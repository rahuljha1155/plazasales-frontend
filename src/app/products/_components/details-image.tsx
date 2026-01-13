import Image from "next/image";

export default function DetailsImage({ images }: { images: string[] | undefined }) {
    if (!images || images.length === 0) {
        return null;
    }

    return (
        <div className={`space-y-3 sm:space-y-0 sm:grid ${images?.length && images?.length >= 2 ? " lg:grid-cols-2" : " lg:grid-cols-1"} items-start gap-4`}>
            <h2 className="leading-none text-[22px] font-medium will-change-transform sm:text-3xl   font-overusedGrotesk mb-4 text-primary col-span-2">Detail Images</h2>
            {
                images?.map((image, index) => (
                    <div className="w-full aspect-video rounded-sm  border overflow-hidden" key={index}>
                        <Image

                            src={image}
                            alt="product"
                            width={500}
                            height={500}
                            className="w-full  h-full object-cover "
                        />
                    </div>
                ))
            }
        </div>
    )
}