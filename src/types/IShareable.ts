export interface IShareable {
  id: string;
  createdAt: string;
  updatedAt: string;
  sortOrder: number;
  product?: {
    id: string;
    name: string;
    slug: string;
    isPublished: boolean;
    isPopular: boolean;
  };
  kind: "BROCHURE" | "MANUAL" | "CATALOG" | "DATASHEET" | "OTHER";
  title: string;
  mediaAsset: {
    id: string;
    createdAt: string;
    updatedAt: string;
    sortOrder: number;
    fileUrl: string;
    type: "IMAGE" | "DOCUMENT" | "VIDEO";
  };
  fileType: string;
  isActive: boolean;
  extra?: string;
}

export interface IShareableResponse {
  status: number;
  message: string;
  data: {
    shareables: IShareable[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  cached: boolean;
}
