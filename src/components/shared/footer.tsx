"use client";
import React from "react";
import Image from "next/image";
import TransitionLink from "./transition-link";
import { Icon } from "@iconify/react";
import { useBrandStore } from "@/store/useBrandStore";
import Link from "next/link";
import { api } from "@/config/axios.config";
import { toast } from "sonner";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const Footer = () => {
  const { brands, fetchBrands } = useBrandStore();
  const [email, setEmail] = React.useState("");
  const [name] = React.useState("User");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const subscribe = async () => {
    if (!executeRecaptcha) {
      toast.error("Recaptcha not yet available");
      return;
    }
    try {
      setIsSubmitting(true);
      const token = await executeRecaptcha("newsletter_subscribe");
      const response = await api.post(
        "/newsletter/subscribe",
        { email, name },
        {
          headers: {
            "X-Recaptcha-Token": token,
          },
        }
      );
      toast.success(response?.data?.message || "Subscribed successfully!", {
        description:
          "Thank you! for subscription. You will start receiving our newsletters.",
        icon: null,
        descriptionClassName: "text-zinc-200! mt-2!",
        className: "text-white! bg-green-500! ",
        position: "top-right",
      });
      setEmail("");
    } catch (error: unknown) {
      // Safely access error.response using type assertion
      const errorMessage =
        (error as any)?.response?.data?.message ||
        "Failed to subscribe. Please try again later.";
      toast.error(errorMessage, {
        description: "Please check your details and try again.",
        icon: null,
        descriptionClassName: "text-zinc-200! mt-2!",
        className: "text-white! bg-red-500! ",
        position: "top-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  React.useEffect(() => {
    if (
      brands.length === 0 &&
      !useBrandStore.getState().hasFetched &&
      !useBrandStore.getState().isLoading
    ) {
      fetchBrands();
    }
  }, [brands.length, fetchBrands]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    subscribe();
  };

  return (
    <>
      <hr className="bg-primary md:mb-14 " />
      <footer className="p-4 py-6  w-full max-w-7xl xl:px-0 mx-auto    ">
        <div className="mt-">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-10">
            <div className="col-span-2 md:col-span-1">
              <Image
                src="/logos/letter-logo.png"
                alt="Plaza Sales"
                width={170}
                height={500}
                className="w-full max-w-40"
              />
              <p className="text-sm mt-4  font-light font-poppins ">
                Plaza Sales is dedicated to empowering individuals through
                mindful living, education, and community support.
              </p>

              <div className="flex gap-4 mt-4">
                <TransitionLink
                  href="https://www.facebook.com/share/1BuwkXnq8w/"
                  target="_blank"
                  className="hover:text-primary hover:underline"
                >
                  <Icon icon="ri:facebook-fill" className="size-5" />
                </TransitionLink>
                <TransitionLink
                  href="https://www.instagram.com/plazasales.np?igsh=MXQzd2UyYWdxY3lpeQ=="
                  target="_blank"
                  className="hover:text-primary hover:underline"
                >
                  <Icon icon="mdi:instagram" className="size-5" />
                </TransitionLink>

                <TransitionLink
                  href="https://www.linkedin.com/company/plazasales/"
                  target="_blank"
                  className="hover:text-primary hover:underline"
                >
                  <Icon icon="mdi:linkedin" className="size-5" />
                </TransitionLink>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-3 text-gray-900">
                  Stay Updated
                </h4>
                <form
                  onSubmit={handleSubmit}
                  className="flex items-stretch border max-w-[90vw]! rounded-full border-gray-300  overflow-hidden  focus-within:border-primary transition-all duration-200 w-fit"
                >
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-[60vw] md:w-fit! py-1.5! md:py-2.5 px-4 text-sm border-0 outline-0 bg-white placeholder:text-gray-400 focus:placeholder:text-gray-300"
                    placeholder="Enter your email"
                  />
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 w-25 flex justify-center items-center text-white px-4 border border-primary py-1.5! md:py-2.5 font-medium text-sm transition-colors duration-200  gap-2 group"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Icon
                        icon="eos-icons:loading"
                        className="size-5 animate-spin"
                      />
                    ) : (
                      "Subscribe"
                    )}
                  </button>
                </form>
              </div>
            </div>
            {mounted && brands.length > 0 && (
              <div className="flex md:justify-center">
                <div>
                  <h4 className="text-lg font-semibold mb-4">Our Brands</h4>
                  <ul className="space-y-2 text-sm">
                    {brands?.map((brand) => (
                      <li key={brand.id}>
                        <TransitionLink
                          href={`/brand/${brand.slug}`}
                          className="hover:text-primary hover:underline"
                        >
                          {brand.name}
                        </TransitionLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            <div className="flex md:justify-center">
              <div className="">
                <h4 className="text-lg font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <TransitionLink
                      href="/cookies-policy"
                      className="hover:text-primary hover:underline"
                    >
                      Cookies Policy
                    </TransitionLink>
                  </li>
                  <li>
                    <TransitionLink
                      href="/terms-and-conditions"
                      className="hover:text-primary hover:underline"
                    >
                      Terms & Conditions
                    </TransitionLink>
                  </li>
                  <li>
                    <TransitionLink
                      href="/privacy-policy"
                      className="hover:text-primary hover:underline"
                    >
                      Privacy Policy
                    </TransitionLink>
                  </li>
                  <li>
                    <TransitionLink
                      href="/faq"
                      className="hover:text-primary hover:underline"
                    >
                      FAQs
                    </TransitionLink>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex md:justify-center col-span-2 md:col-span-1 ">
              <div className="">
                <h4 className="text-lg font-semibold mb-4 ">Contact Us</h4>
                <ul className="space-y-3 grid grid-cols-2 md:grid-cols-1 gap-4 gap-y-0 sm:gap-y-4 lg:gap-y-0 sm:gap-10 lg:gap-0 ">
                  <li className="space-y-2   h-full md:bg-transparent  md:p-0 rounded-md">
                    <h2 className="font-semibold text-primary   text-sm">
                      Head Office
                    </h2>
                    <div className="flex text-xs items-start gap-2 max-w-[90%] ">
                      <span>Biratnagar, Nepal</span>
                    </div>
                  </li>
                  <li className="space-y-2  h-full md:bg-transparent  md:p-0 rounded-md ">
                    <h2 className="font-semibold text-primary   text-sm">
                      Corporate Office
                    </h2>
                    <div className="flex text-xs items-start gap-2 max-w-[90%]">
                      <span>
                        Barahikshetra Auto Repairs, Bishal Nagar Marg,
                        kathmandu, Nepal
                      </span>
                    </div>
                  </li>

                  <li className="col-span-2 md:col-span-1 ">
                    <Link href="tel:+977-1-4780236" className="space-y-1">
                      {/* <Icon icon="mdi:phone" className="size-4" /> */}
                      <h2 className="font-semibold text-sm text-primary">
                        Phone
                      </h2>
                      <span className="flex items-center gap-2 hover:text-primary hover:underline text-xs">
                        +977-1-4780236
                      </span>
                    </Link>
                  </li>
                  <li className="col-span-2  md:col-span-1">
                    <Link
                      href="mailto:info@plazasales.com"
                      className="space-y-1"
                    >
                      <h2 className="font-semibold text-sm text-primary">
                        Email
                      </h2>
                      <span className="flex items-center gap-2 hover:text-primary hover:underline text-xs">
                        info@plazasales.com
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <hr className="bg-primary  mb-1" />

      <div className=" max-w-7xl mx-auto font-poppins font-light   py-2 flex flex-col sm:flex-row items-center justify-center md:justify-between text-sm  px-4 xl:px-0">
        <span>© Copyright 2025 | Plaza Sales Pvt. Ltd.</span>
        <Link
          href="https://webxnepal.com/"
          target="_blank"
          className="flex items-center text-sm gap-2 mt-1 md:mt-3 sm:mt-0  transition"
        >
          <span>Design & Developed by:</span>
          <svg
            className="w-10 md:w-14 hover:scale-105"
            viewBox="0 0 238 74"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M66.7355 30.667L58.1754 52.5818L45.675 20.8291H36.0279L23.6633 52.5139L15.1032 30.5991C12.7933 24.6964 7.08655 20.7612 0.700439 20.7612L18.9076 67.1011H28.4868L40.9873 35.3485L53.3519 67.1011H62.999L81.2062 20.7612C74.8201 20.7612 69.1133 24.6964 66.8035 30.5991L66.7355 30.667Z"
              className="fill-zinc-800 dark:fill-zinc-100"
            />
            <path
              d="M104.304 20.8286C98.122 20.8286 92.3474 23.2033 87.9314 27.6134C83.5155 32.0235 81.1377 37.7905 81.1377 43.9646C81.1377 50.1388 83.5155 56.0415 87.9314 60.3837C92.3474 64.726 98.122 67.1685 104.304 67.1685C108.109 67.1685 111.845 66.2865 115.106 64.5903C118.231 62.962 121.017 60.5194 123.123 57.6698L123.802 56.72L115.854 50.9529L115.174 51.9028C113.951 53.5311 112.389 54.9559 110.555 55.9058C108.652 56.9235 106.478 57.3984 104.304 57.3984C98.8014 57.3984 93.9099 53.9382 91.9397 48.9175H127.539V44.0325C127.539 37.8583 125.161 32.0913 120.745 27.6812C116.329 23.2711 110.555 20.8964 104.304 20.8964V20.8286ZM104.304 30.5987C109.875 30.5987 114.767 33.991 116.805 39.0118H91.9397C93.9099 33.991 98.8014 30.5987 104.304 30.5987Z"
              className="fill-zinc-800 dark:fill-zinc-100"
            />
            <path
              d="M174.281 27.6138C169.933 23.2716 164.09 20.8291 157.84 20.8291C153.084 20.8291 148.397 22.3217 144.524 25.1035V10.1092C144.524 4.68135 140.108 0.339111 134.741 0.339111V67.169H157.908C164.158 67.169 170.001 64.7943 174.349 60.3842C178.697 55.9741 181.142 50.2071 181.142 43.9651C181.142 37.7231 178.697 32.0239 174.349 27.6138H174.281ZM171.02 46.6111C170.001 51.9033 165.789 56.1098 160.489 57.1275C159.606 57.3311 158.723 57.3989 157.908 57.3989H144.524V44.0329C144.524 43.4223 144.524 42.8795 144.66 42.2689C145.407 36.2983 150.231 31.4812 156.209 30.8027C165.245 29.6493 172.854 37.5874 171.088 46.679L171.02 46.6111Z"
              className="fill-zinc-800 dark:fill-zinc-100"
            />
            <path
              d="M225.437 6.92065H237.598L188.548 73.8183H176.387L225.437 6.92065Z"
              fill="url(#paint0_linear_70_2)"
            />
            <path
              d="M193.303 20.8286L202.95 33.991H190.721L193.303 20.8286Z"
              fill="#5C53A3"
            />
            <path
              d="M202.95 33.9915L196.836 42.3367L190.721 33.9915H202.95Z"
              fill="#32C5F4"
            />
            <path
              d="M181.074 20.8286H193.303L190.721 33.991L181.074 20.8286Z"
              fill="#ED228B"
            />
            <path
              d="M215.043 67.169L205.396 54.0066H217.624L215.043 67.169Z"
              fill="#F57E20"
            />
            <path
              d="M205.396 54.0061L211.51 45.6609L217.624 54.0061H205.396Z"
              fill="#FECF0A"
            />
            <path
              d="M227.272 67.169H215.043L217.625 54.0066L227.272 67.169Z"
              fill="#EF3F23"
            />
            <defs>
              <linearGradient
                id="paint0_linear_70_2"
                x1="227.476"
                y1="4.95307"
                x2="186.658"
                y2="75.697"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#0D85C8" />
                <stop offset="0.51" stopColor="#652C8E" />
                <stop offset="1" stopColor="#DF0D7B" />
              </linearGradient>
            </defs>
          </svg>
        </Link>
      </div>

      <div className="mb-16 lg:mb-0"></div>
    </>
  );
};

export default Footer;
