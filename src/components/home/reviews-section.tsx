import { getAllReviews } from "@/services/reviewService";
import Title from "./title";
import ReviewsList from "./reviews-list";

export const revalidate = 10;

export default async function ReviewsSection() {
    const response = await getAllReviews();
    const reviews = response.reviews || [];

    return (
        <section className="py-16 md:py-24 bg-zinc-50/50 dark:bg-zinc-950/50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 xl:px-0">
                <div className="flex flex-col items-center text-center mb-12">
                    <Title title="Customer Reviews" />
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mt-4">
                        Don&apos;t just take our word for it. Hear from our satisfied customers who have experienced the Plaza Sales difference.
                    </p>
                </div>

                <ReviewsList reviews={reviews} options={{ loop: true, align: "start" }} />
            </div>
        </section>
    );
}
