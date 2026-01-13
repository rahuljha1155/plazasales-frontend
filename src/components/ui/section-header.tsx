import React from "react";

export default function SectionHeader({
  title,
  desc,
  descClassName,
  titleClassName
}: {
  title: string;
  desc?: string;
  icon?: React.ReactNode;
    titleClassName?: string;
    descClassName?: string;
}) {
  return (
    <div>
      <h2 className={`leading-none text-[22px] font-medium will-change-transform sm:text-3xl   font-overusedGrotesk mb-4 text-primary  ${titleClassName}`}>{title}</h2>
      {desc && <p className={`text-muted-foreground ${descClassName}`}>{desc}</p>}
    </div>
  );
}
