"use client";
import { IMAGEKIT_URL_ENDPOINT } from "@/lib/utils/imageUtils";
import React, { useState } from "react";
import VideoModal from "../VideoModal/VideoModal";
import Link from "next/link";
import { Play, ArrowRight } from "lucide-react";

const Cta = () => {
  const [iframeSrc, setIframeSrc] = useState("about:blank");
  const [toggle, setToggle] = useState(false);

  const handelClick = () => {
    setIframeSrc("https://www.youtube.com/embed/HC-tgFdIcB0");
    setToggle(true);
  };
  
  const handelClose = () => {
    setIframeSrc("about:blank");
    setToggle(false);
  };

  const backgroundImage = `${IMAGEKIT_URL_ENDPOINT}/assets/img/cta/mountain-trip-family.jpg`;

  return (
    <section
      className="cta-bg-section fix bg-cover relative"
      data-background={backgroundImage}
      style={{
        backgroundImage: `url('${backgroundImage}')`,
      }}
      suppressHydrationWarning
    >
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      <div className="container relative z-10 px-4 mx-auto py-24">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-8">
            <span className="inline-block text-[#EF7C00] font-bold tracking-widest uppercase mb-3 text-sm md:text-base animate-in fade-in slide-in-from-bottom-4 duration-500">
              Ready to Explore?
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both">
              Start Your Next <br className="hidden md:block" />
              Adventure Today
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
            <Link 
              href="/tours" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#EF7C00] text-white rounded-full font-bold text-lg hover:bg-[#d66e00] transition-all hover:scale-105 active:scale-95 shadow-lg group"
            >
              Explore Tours <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <div className="flex items-center gap-4">
              <button
                onClick={handelClick}
                className="w-14 h-14 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 text-white transition-all hover:scale-110 active:scale-95 group relative"
                aria-label="Play Video"
              >
                <div className="absolute inset-0 rounded-full border border-white/30 animate-ping"></div>
                <Play className="w-6 h-6 ml-1 group-hover:text-[#EF7C00] transition-colors" fill="currentColor" />
              </button>
              <span className="text-white font-semibold text-lg cursor-pointer hover:text-[#EF7C00] transition-colors" onClick={handelClick}>
                Watch Our Story
              </span>
            </div>
          </div>
        </div>
      </div>

      <VideoModal
        isTrue={toggle}
        iframeSrc={iframeSrc}
        handelClose={handelClose}
      />
    </section>
  );
};

export default Cta;
