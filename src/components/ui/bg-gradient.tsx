type BgGradientProps = {
  children: React.ReactNode;
  className?: string;
  bgImage?: string;
  imageClassName?: string;
};

export default function BgGradient({
  children,
  className = "",
  bgImage,
  imageClassName = "",
}: BgGradientProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {bgImage && (
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bgImage}
            alt="background image"
            className={`w-full h-full object-cover select-none ${imageClassName}`}
          />
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
