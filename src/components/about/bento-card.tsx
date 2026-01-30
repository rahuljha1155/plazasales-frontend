"use client"
import React from "react"
import { cn } from "@/lib/utils"
import Title from "../home/title"
import { Icon } from "@iconify/react"
import Image from "next/image"

const cardContents = [
  {
    title: "Innovation at Our Core",
    description:
      "We bring smart technology solutions that help businesses stay ahead. By leveraging the latest in CCTV surveillance, networking infrastructure, HRMS software, and IT hardware, we deliver reliable, future-ready systems designed to improve security, efficiency, and performance.",
    icon: "mage:light-bulb",
  },
  {
    title: "Customer-First Mindset",
    description:
      "Your business comes first. We listen, understand your requirements, and deliver solutions that truly fit your needs. From the first consultation to installation and ongoing support, our team ensures a smooth, transparent, and satisfying experience at every step.",
    icon: "solar:user-heart-outline",
  },
  {
    title: "Trusted Technology Partnerships",
    description:
      "We collaborate with reliable and industry-recognized technology brands to deliver proven, high-quality solutions. Our strong partnerships allow us to offer dependable products, better performance, and long-term value for our customers.",
    icon: "ph:handshake-light",
  },
  {
    title: "End-to-End IT Solutions",
    description:
      "From planning to execution, we handle it all. Our end-to-end solutions cover CCTV systems, structured networking, HRMS implementation, and complete IT hardware supply. Whether it&apos;s a small office or a large enterprise, we provide everything you need under one roof.",
    icon: "iconoir:brain",
  },

  {
    title: "Quality You Can Count On",
    description:
      "We believe in quality without compromise. Every product we sell and every service we deliver is carefully selected and professionally implemented to ensure durability, reliability, and real business value.",
    icon: "la:certificate",
  },
  {
    title: "Support That Never Sleeps",
    description: "Our relationship doesn't end after installation. From setup to troubleshooting and maintenance, our support team is always ready to help. Fast response, expert assistance, and dependable service — whenever you need it.",
    icon: "/icons/endtoend.png",
  }


]


export const PlusCard: React.FC<{
  className?: string
  title: string
  description: string
  icon: string
}> = ({
  className = "",
  title,
  description,
  icon,
}) => {
    const isLocalIcon = icon.startsWith('/');

    return (
      <div
        className={cn(
          "relative border border-dashed border-primary dark:border-zinc-700  p-6 bg-white dark:bg-zinc-950 min-h-[200px]",
          "flex flex-col  justify-between",
          className
        )}
      >
        <CornerPlusIcons />
        <div className="relative z-10 flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center">
            {isLocalIcon ? (
              <Image src={icon} alt="" width={40} height={40} className="size-8 object-contain md:size-12" />
            ) : (
              <Icon icon={icon} className="size-8 md:size-10 text-primary" />
            )}
          </div>
          <h3 className="md:text-xl font-bold text-primary dark:text-gray-100">
            {title}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 md:text-base text-sm">{description}</p>
        </div>
      </div>
    )
  }

export const CornerPlusIcons = () => (
  <>
    <PlusIcon className="absolute text-primary z-30 -top-3 -left-3" />
    <PlusIcon className="absolute text-primary z-30 -top-3 -right-3" />
    <PlusIcon className="absolute text-primary z-30 -bottom-3 -left-3" />
    <PlusIcon className="absolute text-primary z-30 -bottom-3 -right-3" />
  </>
)

const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    strokeWidth="1"
    stroke="currentColor"
    className={`dark:text-white text-black size-6 ${className}`}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
  </svg>
)

export default function BentoCards() {
  return (
    <section className="bg-white max-w-7xl mx-auto py-12 md:py-20 dark:bg-black dark:border-gray-800">

      <div className="max-w-5xl text-center! mx-auto px-4 ">
        <h2 className="  text-black dark:text-white mb-4">
          <Title wrapperClassName="!mb-1 !mx-0 text-center w-full" className=" text-black dark:text-white pb-0!" title="Your Growth Partner" />
        </h2>
        <p className="text-gray-600 text-center! text-sm md:text-xl dark:text-gray-400 ">
          We&apos;re not just a tech company - we&apos;re your growth partners - With a focus on innovation
        </p>
      </div>

      <div className="mx-auto mt-6  md:mt-12 container  border-gray-200 dark:border-gray-800 md:py-12 border-t-0 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 auto-rows-auto gap-4">
          <PlusCard {...cardContents[0]} className="lg:col-span-3 lg:row-span-2" />
          <PlusCard {...cardContents[1]} className="lg:col-span-2 lg:row-span-2" />
          <PlusCard {...cardContents[2]} className="lg:col-span-4 lg:row-span-1" />
          <PlusCard {...cardContents[3]} className="lg:col-span-2 lg:row-span-1" />
          <PlusCard {...cardContents[4]} className="lg:col-span-3 lg:row-span-1" />
          <PlusCard {...cardContents[5]} className="lg:col-span-3 lg:row-span-1" />
        </div>
      </div>
    </section>
  )
}
