"use client";

import { IShareable } from "@/types/IShareable";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState } from "react";

interface ShareableBodyProps {
    shareables: IShareable[];
}

const getKindIcon = (kind: string) => {
    switch (kind) {
        case "BROCHURE":
            return "solar:document-text-bold";
        case "MANUAL":
            return "solar:book-bold";
        case "CATALOG":
            return "solar:documents-bold";
        case "DATASHEET":
            return "solar:clipboard-list-bold";
        default:
            return "solar:document-bold";
    }
};

export default function ShareableBody({ shareables }: ShareableBodyProps) {
    const [filter, setFilter] = useState<string>("ALL");

    // Filter only active shareables and sort by sortOrder
    const sortedShareables = shareables
        .filter(shareable => shareable.isActive)
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    const kinds = ["ALL", ...Array.from(new Set(sortedShareables.map(s => s.kind)))];

    const filteredShareables = filter === "ALL"
        ? sortedShareables
        : sortedShareables.filter(s => s.kind === filter);

    const handleDownload = async (url: string, filename: string) => {
        try {
            // Fetch the file
            const response = await fetch(url);
            const blob = await response.blob();

            // Create a blob URL
            const blobUrl = window.URL.createObjectURL(blob);

            // Create a temporary anchor element to trigger download
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch {
            // Fallback: if CORS fails, use direct link
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 xl:px-0 py-8 sm:py-12">
            {/* Filter Tabs */}
            {kinds.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                    {kinds.map((kind) => (
                        <button
                            key={kind}
                            onClick={() => setFilter(kind)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filter === kind
                                    ? "bg-primary text-white shadow-md scale-105"
                                    : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
                                }`}
                        >
                            {kind}
                        </button>
                    ))}
                </div>
            )}

            {/* Resources Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredShareables.map((shareable) => (
                    <div
                        key={shareable.id}
                        className="group border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-200 bg-white dark:bg-zinc-900 flex flex-row"
                    >
                        {/* Image - Left Side */}
                        <div className="relative w-28 sm:w-32 shrink-0 bg-gray-50 dark:bg-zinc-800 overflow-hidden flex items-center justify-center p-3">
                            {shareable.mediaAsset.type === "IMAGE" ? (
                                <Image
                                    src={shareable.mediaAsset.fileUrl}
                                    alt={shareable.title}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    quality={90}
                                    className="object-cover rounded-2xl p-2"
                                />
                            ) : (
                                <Icon
                                    icon={shareable.mediaAsset.fileUrl.toLowerCase().endsWith('.pdf') ? "vscode-icons:file-type-pdf2" : "solar:document-bold-duotone"}
                                    className="w-14 h-14"
                                />
                            )}
                        </div>

                        {/* Content - Right Side */}
                        <div className="p-3 flex flex-col flex-1 justify-between">
                            <div>
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <Icon icon={getKindIcon(shareable.kind)} className="w-3 h-3 text-primary" />
                                    <span className="text-[10px] font-medium text-primary uppercase">
                                        {shareable.kind}
                                    </span>
                                </div>

                                <h3 className="text-sm font-semibold mb-1.5 line-clamp-2 leading-tight">
                                    {shareable.title}
                                </h3>

                                {shareable.product && (
                                    <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                                        {shareable.product.name}
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={() => handleDownload(shareable.mediaAsset.fileUrl, shareable.title)}
                                className="w-fit py-1.5 px-3 rounded-full text-xs font-medium text-primary border border-primary hover:bg-primary hover:text-white transition-all duration-200 flex items-center gap-1.5"
                            >
                                <Icon icon="ph:download-simple" className="w-3.5 h-3.5" />
                                Download
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredShareables.length === 0 && (
                <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-zinc-800 mb-4">
                        <Icon icon="solar:inbox-line-bold" className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-lg text-muted-foreground">No resources found</p>
                    <p className="text-sm text-muted-foreground mt-2">Try selecting a different filter</p>
                </div>
            )}
        </div>
    );
}
