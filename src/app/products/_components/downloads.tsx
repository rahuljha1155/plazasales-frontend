import { IDownload } from '@/types/IProduct'
import { DownloadCategory } from '@/types/IProductBySlug'
import { Icon } from '@iconify/react'
import { Info } from 'lucide-react'

export default function Downloads({ downloads, categories }: { downloads: IDownload[], categories?: DownloadCategory[] }) {

    if (!downloads || downloads.length === 0) return null

    // Sort downloads by sortOrder
    const sortedDownloads = [...downloads].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

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

    const DownloadCard = ({ download }: { download: IDownload }) => (
        <div className="pb-6 mb-6  border-b last:border-b-0">
            <div className="flex justify-between items-start gap-4 ">
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
                </div>

            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                {
                    download.version && (
                        <div>
                            <span className="font-semibold">Version:</span>
                            <p className="font-medium">{download.version}</p>
                        </div>
                    )
                }
                {
                    download.sizeBytes && (
                        <div>
                            <span className="font-semibold">Size:</span>
                            <p className="font-medium">{formatFileSize(download.sizeBytes)}</p>
                        </div>
                    )
                }
                {
                    download.releasedOn && (
                        <div>
                            <span className="font-semibold">Released:</span>
                            <p className="font-medium">{formatDate(download.releasedOn)}</p>
                        </div>
                    )
                }
                {
                    download.platforms && (
                        <div>
                            <span className="font-semibold">Platform:</span>
                            <p className="font-medium">{download.platforms.join(', ')}</p>
                        </div>
                    )
                }
            </div>


            <div className="flex gap-3 pt-2 mt-6">
                <a
                    href={download.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='flex gap-2 items-center bg-transparent hover:bg-primary text-primary border border-primary px-4 py-2 rounded-full hover:text-white transition-colors'
                >
                    <Icon icon="streamline-flex:download-tray" />
                    Download
                </a>


                {download.mirrors && download.mirrors.length > 0 && (
                    <div className="flex gap-2">
                        {download?.mirrors?.map((mirror, idx) => {
                            if (!mirror.url) return null;

                            return (
                                <a
                                    key={idx}
                                    href={mirror.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className='flex gap-2 items-center bg-transparent hover:bg-gray-100 text-gray-600 border border-gray-300 px-4 py-2 rounded-full transition-colors text-sm'
                                >
                                    {mirror.label}
                                </a>
                            )
                        })}
                    </div>
                )}



            </div>

            {download.extra?.note && (
                <p className="text-sm mt-4 flex gap-2 items-center italic"><span><Info className='size-4' /></span> {download.extra.note}</p>
            )}
        </div>
    );

    return (
        <section className='space-y-6'>
            <h2 className='leading-none text-[22px] font-medium will-change-transform sm:text-3xl   font-overusedGrotesk mb-4 text-primary '>Downloads</h2>

            <div>
                {sortedDownloads?.map((download) => (
                    <DownloadCard key={download.id} download={download} />
                ))}
            </div>
        </section>
    )
}
