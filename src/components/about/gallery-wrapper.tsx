"use client";

import dynamic from 'next/dynamic';

const InteractiveSelector = dynamic(() => import('@/components/about/gallery'), {
    ssr: false,
});

export default InteractiveSelector;
