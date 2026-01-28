"use client";

import React, { useState } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Icon } from "@iconify/react";
import { IReview } from "@/types/IReview";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import ReviewForm from "./review-form";

type PropType = {
    reviews: IReview[];
    options?: EmblaOptionsType;
};

const ReviewsList: React.FC<PropType> = ({ reviews, options }) => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [emblaRef] = useEmblaCarousel(options, [
        Autoplay({
            delay: 4000,
        }),
    ]);

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-8 px-4">
                <div className="flex flex-col">
                    <h3 className="text-xl font-semibold">What Our Customers Say</h3>
                    <p className="text-gray-500 text-sm">Real stories from real people</p>
                </div>
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="gap-2">
                            <Icon icon="mdi:pencil-plus-outline" className="size-5" />
                            Write a Review
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="sm:max-w-[500px]">
                        <SheetHeader className="mb-6">
                            <SheetTitle>Share Your Experience</SheetTitle>
                            <SheetDescription>
                                Your feedback helps us improve and helps others make better choices.
                            </SheetDescription>
                        </SheetHeader>
                        <ReviewForm onSuccess={() => setIsSheetOpen(false)} />
                    </SheetContent>
                </Sheet>
            </div>

            <div className="embla overflow-hidden" ref={emblaRef}>
                <div className="flex touch-pan-y">
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div
                                key={review.id}
                                className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] min-w-0 pl-4"
                            >
                                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl h-full flex flex-col shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex gap-1 mb-3">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Icon
                                                key={star}
                                                icon={star <= review.rating ? "mdi:star" : "mdi:star-outline"}
                                                className={`size-5 ${star <= review.rating ? "text-yellow-400" : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <h4 className="font-bold text-lg mb-2 line-clamp-1">{review.title}</h4>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 grow">
                                        &ldquo;{review.comment}&rdquo;
                                    </p>
                                    <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-50 dark:border-zinc-800">
                                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {review.reviewerName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{review.reviewerName}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="w-full text-center py-10 text-gray-500">
                            No reviews yet. Be the first to write one!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewsList;
