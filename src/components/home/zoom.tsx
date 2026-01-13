'use client';
import React, { useEffect } from 'react';
import { ZoomParallax } from "@/components/ui/zoom-parallax";
import Title from './title';
import Image from 'next/image';
import { api } from '@/config/axios.config';

export interface GalleryResponse {
	status: number;
	message: string;
	data: GalleryData;
}

export interface GalleryData {
	galleries: GalleryItem[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface GalleryItem {
	id: string;
	createdAt: string;
	updatedAt: string;
	sortOrder: number;
	centerImage: string;
	sideImages: string[];
}


export default function DefaultDemo() {

	const [data, setData] = React.useState<GalleryResponse | null>(null);

	const fetchGallery = async (): Promise<void> => {
		try {
			const response = await api.get<GalleryResponse>(`/home-gallery/get-home-galleries`);
			setData(response.data);
		} catch (error) {
		}
	};


	useEffect(() => {
		fetchGallery();
	}, []);



	return (
		<main className="py-8 md:py-10 lg:py-12 lg:min-h-screen w-full  ">
			<div className="relative px-4 xl:px-0 flex flex-col  items-center justify-center">
				<Title title="Focusing on Experience" wrapperClassName="text-center !mx-0 !mb-0 lg:mx-auto" />
				<p className='text-sm md:text-lg text-center mt-1 lg:mt-3'>We Focus on our customer experience through brand and quality service</p>
			</div>
			<div className="w-full px-4 lg:hidden xl:px-0 max-w-7xl mx-auto mt-8">
				<div className="w-full rounded-xl h-60 md:h-80 relative overflow-hidden">
					<Image src={"/feature/outdoor.jpg"} fill quality={90} sizes="(max-width: 768px) 90vw, 95vw" alt='plaza sales' className='h-full object-cover w-full' />
				</div>
			</div>
			<div className="lg:block hidden">
				<ZoomParallax images={data?.data?.galleries || []} />
			</div>
		</main>
	);
}
