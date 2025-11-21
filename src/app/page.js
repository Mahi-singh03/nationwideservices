// components/Home.jsx
'use client';
import Review from "@/app/components/review";
import Typography from "@/app/components/ui/home/typography";
import WhyChooseUs from "./components/ui/home/whyChooseUS";

export default function Home() {
  return (
    <>
      <section className="relative lg:pt-10">
        <div className="absolute inset-0 overflow-hidden " />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto object-cover"
        >
          {/* Mobile-first video source */}
          <source
            src="/hero.mp4"
            type="video/mp4"
            media="(max-width: 768px)"
          />
          {/* Default video source for larger screens */}
          <source
            src="https://res.cloudinary.com/dni5zov67/video/upload/v1763705358/IMG_4981_dfxvcl_online-video-cutter.com_1_ag8tfh.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </section>

       <div className=" w-full flex justify-center pt-9">
            <Typography
              texts={["CANADA", "AUSTRALIA", "USA", "UK", "NEW ZEALAND"]}
              mainClassName={
                "px-4 sm:px-6 md:px-8 bg-white/85 text-[#cd3435]  overflow-hidden py-2 sm:py-3 md:py-4 justify-center rounded-lg text-5xl  sm:text-3xl md:text-5xl font-semibold"
              }
              staggerFrom={"last"}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2000}
            />
          </div>

      <WhyChooseUs />

      <Review />
    </>
  );
}