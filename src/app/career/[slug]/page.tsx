"use client";

import { useState, useEffect } from "react";
import {
    MapPin,
    Users,
    Building2,
    Share2,
    Calendar,
} from "lucide-react";
import { getCareerById } from "@/services/careerService";
import { ICareerDetail } from "@/types/ICareer";
import { TransitionLink } from "@/components/shared";
import { useParams, useRouter } from "next/navigation";
import DOMPurify from "dompurify";
import CustomBreadcrumb from "@/components/ui/custom-breadcum";


const jobTypeMap: Record<string, string> = {
    FULL_TIME: "Full-time",
    PART_TIME: "Part-time",
    CONTRACT: "Contract",
    INTERNSHIP: "Internship",
};

export default function JobDetailPage() {
    const [job, setJob] = useState<ICareerDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [showNotFound, setShowNotFound] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const params = useParams();
    const router = useRouter();
    const { slug } = params;

    useEffect(() => {
        const fetchCareer = async () => {
            try {
                setLoading(true);
                const response = await getCareerById(slug as string);

                if (!response?.career) {
                    setShowNotFound(true);
                    return;
                }

                setJob(response.career);

                // Check if job is already saved
                const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
                const isJobSaved = savedJobs.some((savedJob: { id: string }) => savedJob.id === response.career.id);
                setIsSaved(isJobSaved);
            } catch (err) {
                setShowNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        fetchCareer();
    }, [params.slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading job details...</p>
                </div>
            </div>
        );
    }

    if (showNotFound || !job) {
        return (
            <main>
                <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-start h-[90dvh] md:px-8">
                    <div className="max-w-xl mx-auto space-y-3 text-center">
                        <h3 className="text-primary font-semibold">
                            404 Error
                        </h3>
                        <p className="text-gray-800 uppercase text-4xl font-semibold sm:text-5xl">
                            Job not found
                        </p>
                        <p className="text-gray-600">
                            Sorry, the job you are looking for could not be found or has been removed.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <TransitionLink onClick={() => router.back()} href="#" className="block py-2 px-6 bg-primary/80 hover:bg-primary text-white rounded-sm">
                                Go back
                            </TransitionLink>
                            <TransitionLink href="/career" className="block py-2 px-6 border border-primary text-primary hover:bg-primary hover:text-white rounded-sm">
                                View All Jobs
                            </TransitionLink>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    const handleShare = async () => {
        const shareData = {
            title: job.title,
            text: `Check out this job opportunity: ${job.title} at Plaze Electronics`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback: copy to clipboard
                await navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
            }
        } catch (error) {
        }
    };



    const paths = [
        { name: "Home", href: "/" },
        { name: "Career", href: "/career" },
        { name: job?.title || "Job Details", href: "#" }
    ];

    return (
        <div className="min-h-screen ">
            <div className="bg-muted/80 py-2 px-4 xl:px-0 ">
                <CustomBreadcrumb paths={paths} className='bg-transparent' />
            </div>
            <div className="max-w-7xl mx-auto  px-4 xl:px-0 xl pb-6 sm:pb-8">

                <div className="grid grid-cols-1  lg:grid-cols-3 gap-6 lg:gap-8">

                    <div className="lg:col-span-2  sm:py-4 bg-white space-y-6  rounded-md md:border-sm">
                        {/* Job Header */}
                        <div className="">
                            <div className="flex justify-between items-start mt-4 lg:mt-0 mb-4">
                                <div className="w-full">
                                    <h1 className="text-xl sm:text-3xl  font-bold mb-3 leading-tight">
                                        {job.title}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm sm:text-base text-gray-600 mb-4">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                            <span className="font-medium">Plaze Electronics</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                            <span>{job.location}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 sm:gap-3">
                                        <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-green-500 text-white  px-2.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium">
                                            # {jobTypeMap[job.jobType] || job.jobType}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-green-500 text-white px-2.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium">
                                            {job.salaryRange}
                                        </span>
                                        <div className="inline-flex items-center bg-orange-500 gap-1.5 sm:gap-2 text-white  px-2.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium">
                                            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                                            <span>Closes on {new Date(job?.expiryDate).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}</span>

                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600  mt-5 border-t">

                            </div>
                        </div>


                        {/* Job Description */}
                        <div className="">
                            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">About the role</h2>
                            <div
                                className="text-sm sm:text-base text-gray-700 leading-relaxed prose prose-sm sm:prose-base max-w-none"
                                dangerouslySetInnerHTML={{ __html: job.description.overview }}
                            />
                        </div>

                        {/* Requirements */}
                        <div className="bg-white  ">
                            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                                Summary
                            </h2>
                            <div id="editor" className="space-y-2 " dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(job.requirements) }}>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 ">
                        <div className="space-y-4 sm:space-y-6 lg:sticky lg:top-6">

                            <div className="bg-white rounded-lg md:border border-gray-100 sm:p-6 ">
                                <TransitionLink href={`/career/${job.slug}/apply`}>
                                    <button className="w-full bg-primary text-white py-2 sm:py-3 rounded-full! text-sm sm:text-base font-medium hover:bg-primary/90 border border-primary transition-all">
                                        Apply Now
                                    </button>
                                </TransitionLink>
                                <button
                                    onClick={handleShare}
                                    className="w-full mt-3 border border-gray-300 text-gray-700 py-2 sm:py-3 rounded-full! text-sm sm:text-base font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span>Share</span>
                                </button>
                            </div>

                            {/* Company Info */}
                            <div className="bg-white rounded-lg  sm:p-6  sm:border border-gray-100">
                                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">About Plaze Electronics</h3>
                                <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-gray-600">
                                    <div className="flex items-center gap-2.5 sm:gap-3">
                                        <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 flex-shrink-0" />
                                        <span>Technology & Electronics</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 sm:gap-3">
                                        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 flex-shrink-0" />
                                        <span>50+ employees</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 sm:gap-3">
                                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 flex-shrink-0" />
                                        <span>Addis Ababa, Ethiopia</span>
                                    </div>
                                </div>
                                <p className="mt-3 sm:mt-4 text-gray-700 text-xs sm:text-sm leading-relaxed">
                                    Leading provider of security systems, networking solutions, and
                                    technology products in Ethiopia.
                                </p>
                                <TransitionLink
                                    href="/about"
                                    className="inline-block mt-3 sm:mt-4 text-primary font-semibold text-xs sm:text-sm hover:underline"
                                >
                                    Learn more about us →
                                </TransitionLink>
                            </div>

                            {/* Job Details */}
                            <div className="bg-white rounded-lg  sm:p-6 sm:border-sm sm:border border-gray-100">
                                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Job Details</h3>
                                <div className="space-y-3 sm:space-y-4">
                                    <div>
                                        <p className="  mb-1">Department</p>
                                        <p className="text-sm sm:text-base  text-primary/80">{job.department}</p>
                                    </div>
                                    <div>
                                        <p className="  mb-1">Employment Type</p>
                                        <p className="text-sm sm:text-base  text-primary/80">{jobTypeMap[job.jobType] || job.jobType}</p>
                                    </div>
                                    <div>
                                        <p className="   mb-1">Salary Range</p>
                                        <p className="text-sm sm:text-base  text-primary/80">{job.salaryRange}</p>
                                    </div>
                                    <div>
                                        <p className="  mb-1">Location</p>
                                        <p className="text-sm sm:text-base  text-primary/80">{job.location}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
