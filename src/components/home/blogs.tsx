import Title from "./title";
import { getAllBlogs } from "@/services/blogService";
import BlogCard from "../ui/blogs-card";
import BlogsCarousel from "./blog-carousel";
import { TransitionLink } from "../shared";
import { Icon } from "@iconify/react";
import { Button } from "../ui/button";

export const revalidate = 10;

export default async function Blogs() {
  const blogs = await getAllBlogs();
  const data = blogs?.data?.blogs;
  const displayBlogs = data?.slice(0, 3) || [];

  return (
    <div className="pt-6 lg:pt-0 pb-10 " style={{ willChange: "auto" }}>
      <div className="max-w-7xl px-4 xl:px-0 mx-auto hidden lg:block">
        <div className="flex  flex-col justify-center items-center text-center">
          <Title
            title="Latest Blogs"
            wrapperClassName="text-center! !mx-0 !mb-0 lg:mx-auto"
          />
          <p className="text-sm md:text-lg mt-1 lg:mt-3 text-center w-full ">
            Our Exclusive Blogs and ideas on Technologies
          </p>
        </div>

        <div className="grid grid-cols-2 mt-6 md:mt-12 md:grid-cols-2 gap-3 md:gap-8 lg:gap-5 lg:grid-cols-3">
          {displayBlogs.map((blog) => (
            <TransitionLink key={blog.id} href={`/blogs/${blog.slug}`}>
              <BlogCard data={blog} />
            </TransitionLink>
          ))}
        </div>
      </div>

      <div className=" lg:hidden px-4 flex flex-col justify-center items-center ">
        <Title title="Latest Blogs" />
        <p className="text-sm md:text-lg mt-1 lg:mt-3 mb-6 text-center">
          Our Exclusive Blogs and ideas on Technologies
        </p>

        <BlogsCarousel slides={data || []} options={{ loop: true }} />
      </div>

      {data && data.length > 3 && (
        <div className="flex lg:px-4 justify-center  items-center">
          <TransitionLink href="/blogs">
            <Button variant={"outline"} className="mt-8 cursor-pointer ">
              View All Blogs{" "}
              <Icon
                icon="mdi:arrow-right"
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Button>
          </TransitionLink>
        </div>
        // fgdhgds
      )}
    </div>
  );
}
