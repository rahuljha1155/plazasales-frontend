'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef, useMemo } from 'react';
import { GalleryItem } from '../home/zoom';
import Image from 'next/image';



interface ZoomParallaxProps {
	images: GalleryItem[];
}

const imagePositions = [
	'', // index 0 - center
	'[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[15vw]',
	'[&>div]:!-top-[10vh] [&>div]:!-left-[23.5vw] [&>div]:!h-[45vh] [&>div]:!w-[14vw]',
	'[&>div]:!left-[26.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]',
	'[&>div]:!top-[27.5vh] [&>div]:!left-[4vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]',
	'[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]',
	'[&>div]:!top-[24vh] [&>div]:!left-[25vw] [&>div]:!h-[18vh] [&>div]:!w-[20vw]',
];

export function ZoomParallax({ images }: ZoomParallaxProps) {
	const container = useRef<HTMLDivElement>(null);
	const urls = [images[0]?.centerImage, images[0]?.sideImages[0], images[0]?.sideImages[1], images[0]?.sideImages[2], images[0]?.sideImages[3], images[0]?.sideImages[4],];
	const { scrollYProgress } = useScroll({
		target: container,
		offset: ['start start', 'end end'],
	});

	const scale4 = useTransform(scrollYProgress, [0, 1], [1, 3.4]);
	const scale5 = useTransform(scrollYProgress, [0, 1], [1, 3]);
	const scale6 = useTransform(scrollYProgress, [0, 1], [1, 4]);
	const scale8 = useTransform(scrollYProgress, [0, 1], [1, 6]);
	const scale9 = useTransform(scrollYProgress, [0, 1], [1, 6]);

	const scales = useMemo(
		() => [scale4, scale5, scale6, scale5, scale6, scale8, scale9],
		[scale4, scale5, scale6, scale8, scale9]
	);

	const imageElements = useMemo(() => {
		return urls?.map((url, index) => {
			const scale = scales[index % scales.length];
			const positionClass = imagePositions[index] || '';

			return (
				<motion.div
					key={`${url}-${index}`}
					style={{ scale, willChange: 'transform' }}
					className={`absolute top-0 flex h-full w-full items-center justify-center ${positionClass}`}
				>
					<div className="relative rounded-lg overflow-hidden h-[25vh] w-[25vw] [image-rendering:crisp-edges] [image-rendering:-webkit-optimize-contrast]">
						<Image
							src={url || '/brokenimg.jpg'}
							alt={`Parallax image ${index + 1}`}
							fill
							quality={100}
							priority={index === 0}
							sizes="(max-width: 1024px) 100vw, 200vw"
							className={`object-contain ${url === images[0]?.centerImage ? "object-cover" : ""}`}
							style={{
								imageRendering: 'crisp-edges',
								WebkitFontSmoothing: 'antialiased',
								backfaceVisibility: 'hidden',
								transform: 'translateZ(0)',
							}}
						/>
					</div>
				</motion.div>
			);
		});
	}, [images, scales]);

	if (urls.length === 0) {
		return null;
	}
	return (
		<div ref={container} className="relative md:h-[300vh]">
			<div className="sticky top-0 h-screen overflow-hidden">
				{imageElements}
			</div>
		</div>
	);
}
