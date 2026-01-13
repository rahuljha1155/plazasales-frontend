import {
  ContainerInset,
  ContainerScroll,
} from "@/components/about/hero-video"
import { Button } from "@/components/ui/button"
import { TransitionLink } from "../shared"

const AboutHero = () => {
  return (
    <ContainerScroll className="text-center   pt-8 md:pt-20 pb-0 h-auto  lg:h-[200vh] xl:h-[170vh] ">

      <h1 className="text-2xl md:text-3xl lg:text-4xl  font-semibold">
        Innovating Today,  <br /> Empowering Tomorrow
      </h1>

      <p className="text-sm md:text-base  max-w-5xl mx-auto p-2 rounded-full text-zinc-800 md:mt-6 font-medium px-4">
        We&apos;re not just a tech company, we&apos;re your partners in digital transformation. From cutting-edge CCTV solutions to complete IT infrastructure, we bring passion, expertise, and innovation to every project we touch.
      </p>
      <div className="flex gap-2 sm:gap-4 justify-center items-center flex-wrap mt-8">
        <TransitionLink href="/products">
          <Button
            variant={"default"}
            size="lg"
            className="text-xs! sm:text-base"
          >
            Browse Products
          </Button>
        </TransitionLink>
        <TransitionLink href="/contact">

          <Button
            variant={"outline"}
            size="lg"
            className="text-xs! sm:text-base"
          >
            Make Inquiry
          </Button>
        </TransitionLink>
      </div>

      <div className="lg:hidden flex h-full w-full px-4 rounded-sm   overflow-hidden mt-6 ">
        <video
          width="100%"
          height="100%"
          loop
          playsInline
          autoPlay
          muted
          preload="auto"
          src={'/video/cam.mp4'}
          className="relative z-10 flex h-auto w-full text-black rounded-sm max-h-full max-w-full  object-contain align-middle"
        >
          <source
            src="/video/cam.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      <ContainerInset className="mt-8 md:mt-0 hidden lg:block">
        <video
          width="100%"
          height="100%"
          loop
          playsInline
          autoPlay
          muted
          preload="auto"
          className="relative z-10 block h-auto max-h-full max-w-full object-contain align-middle"
        >
          <source
            src="/video/cam.mp4"
            type="video/mp4"
          />
        </video>
      </ContainerInset>
    </ContainerScroll>
  )
}



export { AboutHero }
