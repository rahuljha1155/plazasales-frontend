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

const getKindColor = (kind: string) => {
  switch (kind) {
    case "BROCHURE":
      return "bg-blue-500/10 text-blue-600";
    case "MANUAL":
      return "bg-green-500/10 text-green-600";
    case "CATALOG":
      return "bg-purple-500/10 text-purple-600";
    case "DATASHEET":
      return "bg-orange-500/10 text-orange-600";
    default:
      return "bg-gray-500/10 text-gray-600";
  }
};

export default function ShareableBody({ shareables }: ShareableBodyProps) {
  const [filter, setFilter] = useState<string>("ALL");

  const kinds = ["ALL", "BROCHURE", "MANUAL", "CATALOG", "DATASHEET"];
  
  const filteredShareables = filter === "ALL" 
    ? shareables 
    : shareables.filter(s => s.kind === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 xl:px-0 py-12">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {kinds.map((kind) => (
          <button
            key={kind}
            onClick={() => setFilter(kind)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === kind
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700"
            }`}
          >
            {kind}
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShareables.map((shareable) => (
          <div
            key={shareable.id}
            className="group border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 bg-white dark:bg-zinc-900"
          >
            {/* Image/Preview */}
            <div className="relative aspect-video bg-gray-100 dark:bg-zinc-800 overflow-hidden">
              {shareable.mediaAsset.type === "IMAGE" ? (
                <Image
                  src={shareable.mediaAsset.fileUrl}
                  alt={shareable.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Icon
                    icon="solar:document-bold-duotone"
                    className="w-20 h-20 text-gray-400"
                  />
                </div>
              )}
              
              {/* Kind Badge */}
              <div className="absolute top-3 right-3">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getKindColor(shareable.kind)}`}>
                  <Icon icon={getKindIcon(shareable.kind)} className="w-3 h-3" />
                  {shareable.kind}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                {shareable.title}
              </h3>
              
              {shareable.product && (
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {shareable.product.name}
                </p>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">
                  {shareable.fileType}
                </span>
                
                <a
                  href={shareable.mediaAsset.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  <Icon icon="solar:download-bold" className="w-4 h-4" />
                  Download
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredShareables.length === 0 && (
        <div className="text-center py-12">
          <Icon icon="solar:inbox-line-bold" className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-muted-foreground">No resources found</p>
        </div>
      )}
    </div>
  );
}
