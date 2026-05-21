"use client";
import { IMAGEKIT_URL_ENDPOINT } from "@/lib/utils/imageUtils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { IconTick } from "../Common/icons";
import { Container, Section, Grid } from "../Common";
import { ArrowRight } from "lucide-react";

const About = () => {
  const pathname = usePathname();
  const isAboutUsPage = pathname === "/about-us";
  
  return (
    <Section padding="lg" className="py-20 overflow-hidden bg-white">
      <Container>
        <Grid cols={1} className="lg:grid-cols-2" gap="lg" align="center">
          {/* Images Section */}
          <div className="flex justify-center items-center w-full px-8 md:px-12 py-8">
            <div className="relative w-full max-w-[400px] aspect-square">
              {/* Main Image */}
              <Image
                src={`${IMAGEKIT_URL_ENDPOINT}/assets/img/about/about1.webp`}
                alt="Dazzling Tours team creating memorable travel experiences"
                fill
                priority
                className="rounded-3xl object-cover shadow-lg"
              />
              
              {/* Overlapping Image 2 (Bottom Right) */}
              <div className="absolute -bottom-8 -right-8 w-36 h-36 md:w-44 md:h-44 transition-all duration-500 hover:scale-105 z-20">
                <Image
                  src={`${IMAGEKIT_URL_ENDPOINT}/assets/img/about/about2.webp`}
                  alt="Travel experts planning personalized tours"
                  fill
                  className="rounded-2xl object-cover border-[6px] border-white shadow-[0_10px_35px_rgba(0,0,0,0.18)] rotate-2 hover:rotate-0 transition-all duration-300"
                />
              </div>
              
              {/* Overlapping Image 3 (Top Left) */}
              <div className="absolute -top-8 -left-8 w-44 h-44 md:w-52 md:h-52 transition-all duration-500 hover:scale-105 z-0 hidden sm:block">
                <Image
                  src={`${IMAGEKIT_URL_ENDPOINT}/assets/img/about/about3.webp`}
                  alt="Beautiful destinations and travel adventures"
                  fill
                  className="rounded-2xl object-cover border-[6px] border-white shadow-[0_10px_35px_rgba(0,0,0,0.18)] -rotate-6 hover:rotate-0 transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Text Content Section */}
          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <div className="mb-4">
                <span className="inline-block text-[#EF7C00] font-bold tracking-widest uppercase mb-3 text-sm md:text-base animate-in fade-in slide-in-from-bottom-4 duration-500">
                  About Us
                </span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both">
                  Explore the nature with Dazzling Tours
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-base md:text-lg animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
                With years of experience in crafting exceptional travel
                experiences, we specialize in curating personalized tours that
                showcase the world&apos;s most beautiful destinations. Your
                adventure is our passion.
              </p>
            </div>
            
            <div className="flex flex-col gap-5 mb-8">
              {/* Tick Item 1 */}
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 bg-[var(--theme)]/10 text-[var(--theme)] p-2.5 rounded-full mt-1">
                  <IconTick />
                </div>
                <div>
                  <h5 className="font-bold text-gray-900 text-lg mb-1">
                    Curated Experiences
                  </h5>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    Handpicked destinations and carefully planned itineraries tailored to your preferences.
                  </p>
                </div>
              </div>
              
              {/* Tick Item 2 */}
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 bg-[var(--theme)]/10 text-[var(--theme)] p-2.5 rounded-full mt-1">
                  <IconTick />
                </div>
                <div>
                  <h5 className="font-bold text-gray-900 text-lg mb-1">
                    Expert Guidance
                  </h5>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    Professional travel experts dedicated to making your journey seamless and memorable.
                  </p>
                </div>
              </div>
            </div>

            {!isAboutUsPage && (
              <div className="mt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both">
                <Link
                  href="/about-us"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#EF7C00] text-white rounded-full font-bold text-lg hover:bg-[#d66e00] transition-all hover:scale-105 active:scale-95 shadow-lg group"
                >
                  Discover More <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </div>
        </Grid>
      </Container>
    </Section>
  );
};

export default About;
