import { api } from "@/config/axios.config";
import { IShareableResponse } from "@/types/IShareable";

export const shareableService = {
  async getAllShareables(page = 1, limit = 100) {
    const response = await api.get<IShareableResponse>(
      `/shareable/get-all-shareables?page=${page}&limit=${limit}`
    );
    return response.data;
  },
};
