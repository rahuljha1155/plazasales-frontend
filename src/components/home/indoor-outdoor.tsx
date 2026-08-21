"use client";
import { Icon } from "@iconify/react";
import Title from "./title";
import { TransitionLink } from "../shared";
import { useEffect, useState } from "react";
import { getTechnology } from "@/services/technologyService";
import { ITechnology } from "@/types/ITechnology";
import Image from "next/image";
import DOMPurify from "dompurify";

export default function IndoorOutdoor() {
  const [data, setData] = useState<ITechnology[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTechnology();
        setData(data?.data?.technologies);
      } catch (error: unknown) {
        setError("Error Occoured" + error);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return (
      <div className="lg:px-0 py-8 md:py-12 lg:py-20 px-4 xl:px-0  max-w-screen overflow-x-hidden">
        Error occurred
      </div>
    );
  }

  return (
    <section className="lg:px-0 py-8 md:py-12 lg:py-20 px-4 xl:px-0  max-w-screen overflow-x-hidden">
      <div className="relative pointer-events-none flex flex-col  w-full  justify-center items-center">
        <Title
          title="Product Verticals"
          wrapperClassName={"!mx-0  mx-auto max-w-4xl"}
        />
        <p className="text-sm md:text-xl mt-1 lg:mt-3 text-center max-w-4xl mx-auto">
          Discover innovative technology designed for your lifestyle
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 mt-6 md:mt-14 gap-4 lg:gap-6 py-2 max-w-7xl mx-auto relative w-full pointer-events-auto">
          {data?.map((item, idx) => {
            return (
              <TransitionLink
                key={idx}
                href={`/technology/${item?.id}`}
                className="group relative overflow-hidden border border-zinc-200 dark:border-zinc-800 rounded-2xl lg:rounded-3xl bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="relative z-10 flex flex-col items-center gap-3 lg:gap-4 p-4 md:p-5">
                  {/* Text Section */}
                  <div className="flex-1 w-full max-w-md mx-auto flex flex-col justify-center items-center text-center space-y-2 lg:space-y-3">
                    <h3 className="text-lg lg:text-xl font-semibold text-zinc-900 dark:text-white tracking-tight text-center">
                      {item.title}
                    </h3>

                    <div>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(item?.description),
                        }}
                        className="text-xs line-clamp-2 lg:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed text-center"
                      ></div>
                    </div>

                    {/* View Details Button */}
                    <div className="inline-flex items-center justify-center gap-1.5 bg-primary text-white font-medium rounded-full px-4 py-1.5 text-xs lg:text-sm transition-all duration-300 group-hover:bg-primary/90">
                      <span>View details</span>
                      <Icon
                        icon="tabler:arrow-right"
                        className="w-3.5 h-3.5 lg:w-4 lg:h-4 group-hover:translate-x-1 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  {/* Image Container */}
                  <div className="w-full lg:w-2/5 shrink-0">
                    <div className="relative aspect-video md:aspect-square rounded-xl overflow-hidden bg-white/50 dark:bg-black/50">
                      <Image
                        height={1000}
                        width={1000}
                        src={item.coverImage}
                        alt={item.title}
                        className="w-full h-full object-contain p-3"
                      />
                    </div>
                  </div>
                </div>
              </TransitionLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}
