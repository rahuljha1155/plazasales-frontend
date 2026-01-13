import Image from "next/image";

interface ImageShowcaseProps {
  indoorImage?: string;
  outdoorImage?: string;
  brandName: string;
}

export default function ImageShowcase({ indoorImage, outdoorImage, brandName }: ImageShowcaseProps) {
  if (!indoorImage && !outdoorImage) {
    return null;
  }

  return (
    <div className="py-12 lg:py-20 ">
      <div className="max-w-7xl md:grid-cols-2 mx-auto px-4 xl:px-0 grid gap-6">
        {indoorImage && (
          <div className="h-fit w-full">
            <h2 className="text-xl lg:text-3xl text-center md:text-left font-semibold">Indoor Image</h2>
            <div className="w-full rounded-md overflow-hidden border relative group mt-6">
              <Image
                height={1000}
                width={1000}
                src={indoorImage}
                className="w-full aspect-video object-cover max-w-4xl"
                alt={`${brandName} indoor image`}
                loading="lazy"
                draggable={false}
              />
            </div>
          </div>
        )}

        {outdoorImage && (
          <div className="h-fit w-full">
            <h2 className="text-xl lg:text-3xl text-center md:text-left font-semibold">Outdoor Image</h2>
            <div className="w-full h-full rounded-md border overflow-hidden relative group mt-6">
              <Image
                height={1000}
                width={1000}
                src={outdoorImage}
                className="w-full aspect-video object-cover"
                alt={`${brandName} outdoor image`}
                loading="lazy"
                draggable={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
