import { api } from "@/config/axios.config";
import { ICreateReviewRequest, IReviewResponse, ISingleReviewResponse } from "@/types/IReview";

export const getAllReviews = async (): Promise<IReviewResponse> => {
    const res = await api.get<IReviewResponse>("/review/get-all-reviews");
    return res.data;
};

export const getReviewById = async (id: string): Promise<ISingleReviewResponse> => {
    const res = await api.get<ISingleReviewResponse>(`/review/get-review/${id}`);
    return res.data;
};

export const createReview = async (data: ICreateReviewRequest, token?: string): Promise<ISingleReviewResponse> => {
    const res = await api.post<ISingleReviewResponse>("/review/create-review", data, {
        headers: token ? { "x-recaptcha-token": token } : undefined,
    });
    return res.data;
};
