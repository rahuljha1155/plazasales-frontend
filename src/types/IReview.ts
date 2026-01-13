export interface IReview {
    id: string;
    reviewerName: string;
    reviewerEmail: string;
    title: string;
    comment: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
}

export interface IReviewResponse {
    status: number;
    message: string;
    reviews: IReview[];
}

export interface ISingleReviewResponse {
    status: number;
    message: string;
    review: IReview;
}

export interface ICreateReviewRequest {
    reviewerName: string;
    reviewerEmail: string;
    title: string;
    comment: string;
    rating: number;
}
