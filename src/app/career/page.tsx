import React from "react";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import { getAllCareers } from "@/services/careerService";
import { ICareer } from "@/types/ICareer";
import { TransitionLink } from "@/components/shared";
import { Icon } from "@iconify/react";

export const metadata = {
    title: 'Career - Plaze Electronics',
    description: 'Join our team at Plaze Electronics and explore exciting career opportunities in the tech industry.',
    keywords: ['Career', 'Jobs', 'Opportunities', 'Tech Jobs', 'Join Our Team', 'Plaze Electronics Careers'],
}

const jobTypeMap: Record<string, string> = {
    FULL_TIME: "Full-time",
    PART_TIME: "Part-time",
    CONTRACT: "Contract",
    INTERNSHIP: "Internship",
};


export const revalidate = 0;

export default async function Career() {
    let jobOpenings: ICareer[] = [];
    let error: string | null = null;

    try {
        const response = await getAllCareers();
        jobOpenings = response.data.careers;
    } catch (err) {
        error = "Failed to load job openings. Please try again later.";
    }
    return (
        <div className="min-h-screen  dark:from-gray-950 dark:to-gray-900">

            <div className="bg-muted/80">
                <section className="relative bg-muted/80 max-w-7xl mx-auto pb-6 py-10 sm:pb-10 overflow-hidden">
                    <div className="  px-4 xl:px-0  relative z-10">
                        <div className="max-w-5xl mx-auto text-center ">

                            <h1 className="text-xl  md:text-2xl font-bold md:font-semibold lg:text-4xl   mb-3 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent leading-tight">
                                Build Your Career With Us
                            </h1>

                            <p className="text-sm hidden  md:text-lg max-w-4xl mx-auto text-gray-600 dark:text-gray-300 mb-10  leading-relaxed">
                                Join a dynamic team that&apos;s shaping the future of technology
                                solutions in Ethiopia. We&apos;re looking for passionate individuals
                                ready to make an impact.
                            </p>

                            <div className="flex   gap-4 lg:gap-10 text-sm md:text-base justify-center items-center">
                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-1 md:gap-3  text-zinc-800 dark:bg-gray-800  l   dark:border-gray-700  transition-shadow">
                                    <div className="p-2">
                                        <Icon icon={"fluent:briefcase-28-regular"} className="w-5 h-5 text-zinc-800" />
                                    </div>
                                    <span className=" text-pr text-xs md:text-base dark:text-gray-200">{jobOpenings.length} Open Positions</span>

                                </div>
                                <div className="flex flex-wrap items-center gap-1 justify-center md:justify-start md:gap-3  text-zinc-800 dark:bg-gray-800  l   dark:border-gray-700  transition-shadow">
                                    <div className="p-2">
                                        <Icon icon={"ph:users"} className="w-5 h-5 text-zinc-800" />
                                    </div>
                                    <span className="text-xs md:text-base text-pr dark:text-gray-200">50+ Team Members</span>

                                </div>
                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-1 md:gap-3  text-zinc-800 dark:bg-gray-800  l   dark:border-gray-700  transition-shadow">
                                    <div className="p-2">
                                        <Icon icon={"ph:building-office-light"} className="w-5 h-5 text-zinc-800" />
                                    </div>
                                    <span className="text-xs md:text-base text-pr dark:text-gray-200">Multiple Departments</span>

                                </div>
                            </div>

                            {/* Section Header */}
                            <div className=" text-center mt-8">
                                <h2 className="text-sm md:text-xl text-green-500  flex gap-2 items-center justify-center   font-bold mb-2  dark:text-white">
                                    <span className="size-3 md:size-4 bg-green-500 ring-1 border-2 animate-pulse rounded-full"></span>  Our Open Positions
                                </h2>
                            </div>
                        </div>
                    </div>
                </section>
            </div>


            {/* Job Openings Section */}
            <div className="bg-white">
                <section className="py-8 md:py-16 max-w-7xl mx-auto">
                    <div className="   xl:px-0">


                        {/* Job Cards Grid starts */}
                        {error ? (
                            <div className="text-center py-12">
                                <p className="text-red-600 dark:text-red-400">{error}</p>
                            </div>
                        ) : jobOpenings.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-600 dark:text-gray-400">No job openings available at the moment.</p>
                            </div>
                        ) : (
                            jobOpenings?.length >= 3 ? (
                                <div className="grid sm:grid-cols-2 w-full  lg:grid-cols-3 justify-center items-center md:divide-y lg:divide-y-0 gap-6">
                                    {jobOpenings.map((job) => (
                                        <div key={job.id} className="group bg-muted/80  w-[90vw]  sm:w-fit  sm:min-w-[200px] md:min-w-[340px] lg:min-w-[400px] p-4  rounded-xl md:bg-white dark:bg-gray-800 pb-4  md:p-6 lg:p-7 md:rounded-2xl  hover:shadow-xl transition-all duration-300 md:border border-gray-200 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/30 flex flex-col h-full">
                                            <div className=" md:mb-5">
                                                <h3 className="text-lg md:text-xl text-primary lg:text-2xl font-bold mb-2 md:text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors">
                                                    {job.title}
                                                </h3>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-400 mb-2 md:mb-5 leading-relaxed flex-grow text-sm md:text-base font-medium">
                                                {job.salaryRange}
                                            </p>
                                            <div className="flex flex-wrap gap-2 md:gap-3 text-sm text-gray-700 dark:text-gray-300 mb-6 md:pb-6 md:border-b border-gray-200 dark:border-gray-700">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                                                    <span className="truncate">{job.location}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                                                    <span>{jobTypeMap[job.jobType] || job.jobType}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 md:gap-3">
                                                <TransitionLink href={`/career/${job.slug}`} className="flex-1">
                                                    <button className="w-full flex items-center justify-center gap-2 bg-white md:bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white md:py-2 text-sm md:text-base py-2 px-4 rounded-full font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all group/btn">
                                                        <span>Details</span>
                                                        <Icon icon={"bi:info-lg"} className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                    </button>
                                                </TransitionLink>
                                                <TransitionLink href={`/career/${job.slug}/apply`} className="flex-1">
                                                    <button className="w-full flex items-center justify-center gap-2 bg-primary text-white py-prbg-primary/10 md:py-2 text-sm md:text-base py-2 px-4 rounded-full font-medium hover:bg-primary/90   transition-all">
                                                        <span>Apply</span>
                                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                    </button>
                                                </TransitionLink>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-wrap justify-center items-center md:divide-y lg:divide-y-0 gap-6">
                                    {jobOpenings.map((job) => (
                                        <div key={job.id} className="group bg-muted/80 w-full  sm:w-fit  sm:min-w-[200px] md:min-w-[340px] lg:min-w-[400px] p-4  rounded-xl md:bg-white dark:bg-gray-800 pb-4  md:p-6 lg:p-7 md:rounded-2xl  hover:shadow-xl transition-all duration-300 md:border border-gray-200 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/30 flex flex-col h-full">
                                            <div className=" md:mb-5">
                                                <h3 className="text-lg md:text-xl text-primary lg:text-2xl font-bold mb-2 md:text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors">
                                                    {job.title}
                                                </h3>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-400 mb-2 md:mb-5 leading-relaxed flex-grow text-sm md:text-base font-medium">
                                                {job.salaryRange}
                                            </p>
                                            <div className="flex flex-wrap gap-1 md:gap-3 text-sm text-gray-700 dark:text-gray-300 mb-6 md:pb-6 md:border-b border-gray-200 dark:border-gray-700">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                                                    <span className="truncate">{job.location}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                                                    <span>{jobTypeMap[job.jobType] || job.jobType}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 md:gap-3">
                                                <TransitionLink href={`/career/${job.slug}`} className="flex-1">
                                                    <button className="w-full flex items-center justify-center gap-2 bg-white md:bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white md:py-2 text-sm md:text-base py-2 px-4 rounded-full font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all group/btn">
                                                        <span>Details</span>
                                                        <Icon icon={"bi:info-lg"} className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                    </button>
                                                </TransitionLink>
                                                <TransitionLink href={`/career/${job.slug}/apply`} className="flex-1">
                                                    <button className="w-full flex items-center justify-center gap-2 bg-primary text-white py-prbg-primary/10 md:py-2 text-sm md:text-base py-2 px-4 rounded-full font-medium hover:bg-primary/90   transition-all">
                                                        <span>Apply</span>
                                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                    </button>
                                                </TransitionLink>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        )}
                    </div>
                </section>
            </div>

        </div>
    );
}
