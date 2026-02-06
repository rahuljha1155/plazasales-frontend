import { IDownload, IDownloadCategory } from '@/types/IProduct'
import { Icon } from '@iconify/react'
import { Info } from 'lucide-react'

interface DownloadsProps {
    downloads?: IDownload[];
    downloadCategories?: IDownloadCategory[];
}

export default function Downloads({ downloads, downloadCategories }: DownloadsProps) {
    const hasCategories = downloadCategories && downloadCategories.length > 0;
    const hasDownloads = downloads && downloads.length > 0;

    if (!hasCategories && !hasDownloads) return null;

    // Create a map of download ID to category
    const downloadCategoryMap = new Map<string, IDownloadCategory>();
    if (hasCategories) {
        downloadCategories.forEach(category => {
            category.items?.forEach(item => {
                downloadCategoryMap.set(item.id, category);
            });
        });
    }

    // Helper function to format file size
    const formatFileSize = (bytes: string) => {
        const size = parseInt(bytes);
        if (size >= 1073741824) return (size / 1073741824).toFixed(2) + ' GB';
        if (size >= 1048576) return (size / 1048576).toFixed(2) + ' MB';
        if (size >= 1024) return (size / 1024).toFixed(2) + ' KB';
        return size + ' bytes';
    };

    // Helper function to format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const DownloadCard = ({ download, category }: { download: IDownload; category?: IDownloadCategory }) => (
        <div className="pb-6 mb-6 border-b last:border-b-0">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className='text-xl font-semibold'>{download.title}</h3>
                        {download.deprecated && (
                            <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-md font-medium">
                                Deprecated
                            </span>
                        )}
                    </div>
                    <p className='text-gray-800 max-w-2xl'>{download.summary}</p>
                    {download.minOsVersion && (
                        <p className="text-sm text-gray-600 mt-2">Minimum OS: {download.minOsVersion}</p>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                        {download.version && (
                            <div>
                                <span className="font-semibold">Version:</span>
                                <p className="font-medium">{download.version}</p>
                            </div>
                        )}
                        {download.sizeBytes && (
                            <div>
                                <span className="font-semibold">Size:</span>
                                <p className="font-medium">{formatFileSize(download.sizeBytes)}</p>
                            </div>
                        )}
                        {download.releasedOn && (
                            <div>
                                <span className="font-semibold">Released:</span>
                                <p className="font-medium">{formatDate(download.releasedOn)}</p>
                            </div>
                        )}
                        {download.platforms && (
                            <div>
                                <span className="font-semibold">Platform:</span>
                                <p className="font-medium">{download.platforms.join(', ')}</p>
                            </div>
                        )}
                        {category && (
                            <div>
                                <span className="font-semibold">Category:</span>
                                <p className="font-medium">{category.title}</p>
                            </div>
                        )}
                    </div>

                    {download.extra?.note && (
                        <p className="text-sm mt-4 flex gap-2 items-center italic">
                            <span><Info className='size-4' /></span> {download.extra.note}
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-2 shrink-0 mt-8">
                    <a
                        href={download.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className='flex gap-2 items-center bg-transparent text-primary px-4 py-2 rounded-full transition-colors'
                    >
                        <span className="bg-primary text-white p-1.5 rounded-full">
                            <Icon icon="streamline-flex:download-tray" className="w-4 h-4" />
                        </span>
                        <span className="hidden sm:inline">Download</span>
                    </a>

                    {download.mirrors && download.mirrors.length > 0 && (
                        <>
                            {download.mirrors.map((mirror, idx) => {
                                if (!mirror.url) return null;
                                return (
                                    <a
                                        key={idx}
                                        href={mirror.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className='flex gap-2 items-center bg-transparent hover:bg-gray-100 text-gray-600 px-4 py-2 rounded-full transition-colors text-sm'
                                    >
                                        <span className="bg-gray-600 text-white p-1.5 rounded-full">
                                            <Icon icon="mdi:link-variant" className="w-3.5 h-3.5" />
                                        </span>
                                        {mirror.label}
                                    </a>
                                );
                            })}
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <section className='space-y-6'>
            <h2 className='leading-none text-[22px] font-medium will-change-transform sm:text-3xl font-overusedGrotesk mb-4 text-primary'>Downloads</h2>

            <div>
                {(hasCategories ? 
                    downloadCategories!
                        .filter(cat => cat.isActive)
                        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                        .flatMap(category => 
                            category.items.map(item => ({ download: item, category }))
                        )
                    : downloads!.map(download => ({ download, category: undefined }))
                )
                    .sort((a, b) => (a.download.sortOrder || 0) - (b.download.sortOrder || 0))
                    .map(({ download, category }) => (
                        <DownloadCard key={download.id} download={download} category={category} />
                    ))}
            </div>
        </section>
    );
}
