"use client";
import React from "react";
import { Icon } from "@iconify/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contactSchema,
  type IFormData,
  ContactPurpose,
} from "@/schema/contact-schema";
import { countries } from "@/data/countries";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { postContact } from "@/services/contactService";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Button } from "@/components/ui/button";

const ContactSection = () => {
  const [loading, setLoading] = React.useState(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [showErrorModal, setShowErrorModal] = React.useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullname: "",
      email: "",
      countryCode: "NP",
      phoneNo: "",
      address: "",
      message: "",
      purpose: undefined,
    },
  });

  // Handler to validate trusted events for inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    onChange: (value: string) => void
  ) => {
    if (!e.isTrusted) {
      return;
    }
    onChange(e.target.value);
  };

  // Handler to validate trusted events for select
  // Since Radix UI Select doesn't provide direct access to the event,
  // we'll track user interactions through pointer/keyboard events
  const [selectInteractionTrusted, setSelectInteractionTrusted] =
    React.useState(false);

  const handleSelectOpen = (e: React.PointerEvent | React.KeyboardEvent) => {
    if (e.isTrusted) {
      setSelectInteractionTrusted(true);
      return;
    } else {
      setSelectInteractionTrusted(false);
      return;
    }
  };

  const handleSelectChange = (
    value: string,
    onChange: (value: string) => void
  ) => {
    if (!selectInteractionTrusted) {
      return;
    }
    onChange(value);
    setSelectInteractionTrusted(false); // Reset after use
  };

  const onSubmit = async (data: IFormData) => {
    if (!executeRecaptcha) {
      return;
    }
    try {
      setLoading(true);
      const token = await executeRecaptcha("contact_form");

      // Get dial code and append to phone number
      const selectedCountry = countries.find(
        (c) => c.code === data.countryCode
      );
      const dialCode = selectedCountry?.dialCode || "+977";
      const fullPhoneNumber = `${dialCode}${data.phoneNo}`;

      // Create modified data with full phone number and remove countryCode
      const submitData = {
        fullname: data.fullname,
        email: data.email,
        phoneNo: fullPhoneNumber,
        address: data.address,
        message: data.message,
        purpose: data.purpose,
      };

      await postContact(submitData, token);
      setShowSuccessModal(true);
      form.reset();
    } catch (error) {
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-4 xl:px-0 max-w-7xl mx-auto py-12">
      <div className="space-y-4 md:space-y-12">
        <div className="flex flex-col justify-center items-center text-center gap-6">
          <h2 className="leading-none text-[22px] font-semibold will-change-transform sm:text-3xl   font-overusedGrotesk">
            Let&apos;s bring stories closer to you.
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-zinc-700 max-w-2xl">
            Whether youre a passionate reader with a question or a bookstore
            owner interested in stocking our titles — we&apos;d love to hear
            from you!
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 lg:space-y-6  mt-10"
          >
            <div className="flex gap-6 md:gap-2 justify-center items-center flex-wrap lg:flex-nowrap">
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <div className="text-lg  font-medium flex flex-col lg:flex-row text-nowrap lg:gap-2">
                        Hello, I&apos;m{" "}
                        <FormControl>
                          <input
                            value={field.value}
                            onChange={(e) =>
                              handleInputChange(e, field.onChange)
                            }
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            placeholder="Full Name*"
                            className="border-b text-primary border-zinc-300 placeholder:text-sm lg:placeholder:text-lg  lg:px-1 bg-transparent w-full flex   focus:outline-none "
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <div className="text-lg  font-medium flex flex-col lg:flex-row text-nowrap lg:gap-2">
                        <div className="shrink-0">and I&apos;m from </div>
                        <FormControl>
                          <input
                            type="text"
                            value={field.value}
                            onChange={(e) =>
                              handleInputChange(e, field.onChange)
                            }
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            placeholder="Your Address*"
                            className="border-b text-primary border-zinc-300  lg:px-1 placeholder:text-sm lg:placeholder:text-lg bg-transparent w-full flex   focus:outline-none "
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <div className="text-lg  font-medium flex flex-col lg:flex-row text-nowrap lg:gap-2">
                    Im reaching out because{" "}
                    <FormControl>
                      <Select
                        onValueChange={(value) =>
                          handleSelectChange(value, field.onChange)
                        }
                        defaultValue={field.value}
                      >
                        <SelectTrigger
                          className="border-0 rounded-xs border-b  text-primary  border-zinc-300  py-0! w-full flex   focus:outline-none "
                          onPointerDown={handleSelectOpen}
                          onKeyDown={handleSelectOpen}
                        >
                          <SelectValue
                            className="!text-xl !text-primary/70"
                            placeholder="Select a purpose..."
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ContactPurpose.CHANNEL_SALES}>
                            {ContactPurpose.CHANNEL_SALES}
                          </SelectItem>
                          <SelectItem value={ContactPurpose.PROJECT_SALES}>
                            {ContactPurpose.PROJECT_SALES}
                          </SelectItem>
                          <SelectItem value={ContactPurpose.ADMINISTRATION}>
                            {ContactPurpose.ADMINISTRATION}
                          </SelectItem>
                          <SelectItem value={ContactPurpose.PROCUREMENT}>
                            {ContactPurpose.PROCUREMENT}
                          </SelectItem>
                          <SelectItem value={ContactPurpose.CAREER}>
                            {ContactPurpose.CAREER}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex w-full flex-wrap  lg:flex-nowrap gap-6 md:gap-2">
              <div className="flex-1 lg:flex w-full ">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <div className="text-lg  font-medium flex w-full  flex-col lg:flex-row text-nowrap lg:gap-2">
                        You can contact me at{" "}
                        <FormControl>
                          <input
                            value={field.value}
                            onChange={(e) =>
                              handleInputChange(e, field.onChange)
                            }
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            type="email"
                            placeholder="Email Address*"
                            className="border-b placeholder:text-sm lg:placeholder:text-lg flex-1 lg:flex lg:min-w-45 text-primary border-zinc-300  lg:px-0  bg-transparent w-full flex   focus:outline-none "
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex w-full">
                <div className="text-lg  font-medium flex-1 lg:flex flex-col lg:flex-row text-nowrap lg:gap-2">
                  <span className="shrink-0">and my number is</span>
                  <div className="flex  w-full flex-wrap sm:flex-nowrap">
                    <FormField
                      control={form.control}
                      name="countryCode"
                      render={({ field }) => (
                        <FormItem className="w-full sm:w-auto max-w-20 ">
                          <FormControl>
                            <Select
                              onValueChange={(value) =>
                                handleSelectChange(value, field.onChange)
                              }
                              defaultValue={field.value}
                            >
                              <SelectTrigger
                                className="border-0 rounded-xs border-b max-h-7.5! py-0! text-primary border-zinc-300  lg:px-1 bg-transparent w-full flex   focus:outline-none "
                                onPointerDown={handleSelectOpen}
                                onKeyDown={handleSelectOpen}
                              >
                                <SelectValue>
                                  {field.value &&
                                  countries.find(
                                    (c) => c.code === field.value
                                  ) ? (
                                    <span className="flex items-center gap-1">
                                      <span>
                                        {
                                          countries.find(
                                            (c) => c.code === field.value
                                          )?.dialCode
                                        }
                                      </span>
                                    </span>
                                  ) : (
                                    "Select code"
                                  )}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="max-h-[300px] max-w-20">
                                {countries.map((country) => (
                                  <SelectItem
                                    key={country.code}
                                    value={country.code}
                                  >
                                    <span className="flex items-center gap-2">
                                      <span className="text-primary">
                                        {country.dialCode}
                                      </span>
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phoneNo"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <input
                              value={field.value}
                              onChange={(e) =>
                                handleInputChange(e, field.onChange)
                              }
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                              placeholder="Phone Number*"
                              className="border-b text-primary placeholder:text-sm lg:placeholder:text-lg border-zinc-300  lg:px-1 bg-transparent w-full flex   focus:outline-none "
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <div className="text-lg  font-medium flex flex-col lg:flex-row text-nowrap gap-2">
                    Here&apos;s a bit more I&apos;d like to share:
                    <FormControl>
                      <textarea
                        value={field.value}
                        onChange={(e) => handleInputChange(e, field.onChange)}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        placeholder="Share your interest, store details, questions..."
                        rows={4}
                        className="border-b placeholder:text-sm lg:placeholder:text-lg text-primary border-zinc-300  lg:px-1 bg-transparent w-full flex   focus:outline-none "
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end items-center">
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary text-white px-4 text-sm md:text-base md:px-4!  md:py-5 cursor-pointer font-semibold flex items-center gap-2 hover:bg-transparent hover:border-primary border hover:text-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Inquiry"}{" "}
                <Icon icon="mynaui:send-solid" width="24" height="24" />
              </Button>
            </div>
          </form>
        </Form>

        {/* Success Modal */}
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ">
                <Icon
                  icon="garden:check-badge-fill-12"
                  className="size-12 text-green-600"
                />
              </div>
              <DialogTitle className="text-center text-2xl">
                Success!
              </DialogTitle>
              <DialogDescription className="text-center">
                Your inquiry has been submitted successfully. We&apos;ll get
                back to you soon!
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="bg-green-500 text-white px-6  rounded-md hover:bg-primary/90 transition"
              >
                Close
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Error Modal */}
        <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Icon
                  icon="mdi:alert-circle"
                  className="h-8 w-8 text-red-600"
                />
              </div>
              <DialogTitle className="text-center text-2xl">Error!</DialogTitle>
              <DialogDescription className="text-center">
                Something went wrong while submitting your inquiry. Please try
                again later.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center">
              <button
                onClick={() => setShowErrorModal(false)}
                className={`bg-red-600 text-white px-6  rounded-md hover:bg-red-700 transition`}
              >
                Close
              </button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="">
          <div className="grid max-w-screen overflow-hidden pt-6 md:grid-cols-2 gap-6 ">
            <div className=" ">
              <h2 className="text-xl md:text-2xl pb-3 text-primary font-semibold">
                Head Office
              </h2>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d2734.7572254307656!2d87.285365!3d26.458056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjbCsDI3JzI5LjAiTiA4N8KwMTcnMDcuMyJF!5e1!3m2!1sen!2snp!4v1767949636289!5m2!1sen!2snp"
                width="600"
                height={300}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div className="">
              <h2 className="text-xl md:text-2xl pb-3 text-primary font-semibold">
                Corporate Office
              </h2>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d338.02033742259755!2d85.3341624!3d27.7182864!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1900599c704d%3A0x6253d9ddf8b71ffa!2sUNV%20Experience%20Center!5e1!3m2!1sen!2snp!4v1767949706937!5m2!1sen!2snp"
                width="600"
                height={300}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
