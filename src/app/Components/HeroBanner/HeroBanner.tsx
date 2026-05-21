import { IMAGEKIT_URL_ENDPOINT } from "@/lib/utils/imageUtils";
import React from "react";
import { getOptimizedImage } from "@/lib/utils/imageUtils";
import { Container } from "@/app/Components/Common";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const HeroBanner2 = () => {
  const heroImage = getOptimizedImage(
    `${IMAGEKIT_URL_ENDPOINT}/assets/img/hero/hero2.webp`,
    1920,
  );

  return (
    <section className="relative w-full min-h-[90vh] flex items-center pt-20">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${heroImage}')` }}
      />
      
      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-0" />

      <Container className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          {/* Animated Subtitle */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
            <span className="w-2 h-2 rounded-full bg-[#EF7C00] animate-pulse" />
            <span className="text-white text-sm font-semibold tracking-wider uppercase">
              Your Adventure Starts Here
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-both delay-150">
            Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EF7C00] to-yellow-400">Nature</span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-200 mb-10 max-w-xl leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-both delay-300">
            Discover breathtaking landscapes and unforgettable experiences with Dazzling Tours. Let us take you on your next extraordinary adventure.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-both delay-500">
            <Link 
              href="/tours" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#EF7C00] text-white rounded-full font-bold text-lg hover:bg-[#d66e00] transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(239,124,0,0.4)]"
            >
              Explore Tours <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-bold text-lg hover:bg-white hover:text-black transition-all hover:scale-105 active:scale-95"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroBanner2;
