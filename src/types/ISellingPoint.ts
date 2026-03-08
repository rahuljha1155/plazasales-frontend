export interface IBrand {
  id: string;
  createdAt: string;
  updatedAt: string;
  sortOrder: number;
  name: string;
  slug: string;
  logoUrl: string;
  certificate: string | null;
  indoorImage: string | null;
  outdoorImage: string | null;
  dropdownImage: string | null;
  youtubeId: string | null;
  themeColor: string;
  playStoreUrl: string;
  appStoreUrl: string;
  description: string;
  usp: string;
  isAuthorizedDistributor: boolean;
  bannerUrls: string[];
  brandImageUrls: string[];
}

export interface ISellingPoint {
  id: string;
  createdAt: string;
  updatedAt: string;
  sortOrder: number;
  icon: string;
  title: string;
  subtitle: string;
  brand: IBrand;
}

export interface ISellingPointResponse {
  status: number;
  message: string;
  data: {
    brandSellingPoints: ISellingPoint[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
