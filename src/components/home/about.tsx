import React from 'react'
import { TransitionLink } from '../shared'
import Image from 'next/image'

export default function About() {
  return (
    <div className="bg-muted/80">
      <div className='px-4 py-8 md:py-16 lg:py-28  max-w-7xl mx-auto '>
        <h2 className='md:flex font-semibold gap-4 flex-col md:flex-row text-center justify-start md:justify-center items-start md:items-center text-xl  md:text-3xl'>
          <span>Plaza Sales </span>
          <span className='hidden md:flex w-32 shrink-0 overflow-hidden relative h-13  rounded-full'>
            <Image src={'/feature/outdoor.jpg'} fill quality={90} sizes="128px" alt='' />
          </span>
          <span> Enhancing Technologies</span>
        </h2>
        <p className='mt-4 md:mt-8 lg:mt-12 md:text-lg text-center  leading-snug '>
          <span className='md:text-xl text-primary'>Plaza Sales Pvt. Ltd.</span> , established in 2014, is Nepal&apos;s leading IT hardware and software provider, offering a wide range of IT-integrated products and solutions. Serving startups to large enterprises, we empower businesses with high-quality hardware, software, and networking solutions that enhance efficiency, security, and sustainable growth. Partnered with trusted brands like <TransitionLink href='/unv' className='hover:underline hover:text-primary inline-block '>UNV</TransitionLink>,<TransitionLink href='/uniarch' className='hover:underline hover:text-primary  inline-block pl-2'>Uniarch</TransitionLink>,<TransitionLink href='/ziasys' className='hover:underline hover:text-primary  inline-block pl-2'>Ziasys</TransitionLink>,<TransitionLink href='/forward' className='hover:underline hover:text-primary  inline-block pl-2'>Forward</TransitionLink>,
          <TransitionLink href='/deli' className='hover:underline hover:text-primary  inline-block pl-2'>Deli</TransitionLink>
          . our expert team delivers tailored IT solutions that help clients stay competitive in today&apos;s rapidly evolving digital landscape.</p>
      </div>
    </div>
  )
}
