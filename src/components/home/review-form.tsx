"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createReview } from "@/services/reviewService";
import { Icon } from "@iconify/react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";


const formSchema = z.object({
    reviewerName: z.string().min(2, "Name must be at least 2 characters"),
    reviewerEmail: z.string().email("Invalid email address"),
    title: z.string().min(2, "Title must be at least 2 characters"),
    comment: z.string().min(5, "Comment must be at least 5 characters"),
    rating: z.number().min(1).max(5),
});

export default function ReviewForm({ onSuccess }: { onSuccess?: () => void }) {
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(5);
    const { executeRecaptcha } = useGoogleReCaptcha();


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            reviewerName: "",
            reviewerEmail: "",
            title: "",
            comment: "",
            rating: 5,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!executeRecaptcha) {
            toast.error("reCAPTCHA not ready. Please try again.");
            return;
        }
        setLoading(true);
        try {
            const token = await executeRecaptcha("review_submit");
            const res = await createReview(values, token);

            if (res.status === 201 || res.status === 200) {
                toast.success("Review submitted successfully!");
                form.reset();
                setRating(5);
                if (onSuccess) onSuccess();
            } else {
                toast.error(res.message || "Failed to submit review");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex gap-4">
                    <FormField
                        control={form.control}
                        name="reviewerName"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="reviewerEmail"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your Email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Review Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Summarize your experience" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Rating</FormLabel>
                            <FormControl>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Icon
                                            key={star}
                                            icon={star <= rating ? "mdi:star" : "mdi:star-outline"}
                                            className={`size-8 cursor-pointer ${star <= rating ? "text-yellow-400" : "text-gray-300"
                                                }`}
                                            onClick={() => {
                                                setRating(star);
                                                form.setValue("rating", star);
                                            }}
                                        />
                                    ))}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Comment</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Share your detailed feedback" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Review"}
                </Button>
            </form>
        </Form>
    );
}
