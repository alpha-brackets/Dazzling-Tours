import { IMAGEKIT_URL_ENDPOINT } from "@/lib/utils/imageUtils";
import Image from "next/image";
import { Container, Section, Grid } from "../Common";

const Choose = () => {
  return (
    <Section
      className="relative overflow-hidden py-20"
      style={{
        background:
          "linear-gradient(135deg, rgba(253, 125, 2, 0.08) 0%, rgba(2, 109, 247, 0.04) 50%, rgba(255, 193, 7, 0.06) 100%)",
      }}
    >
      <Container>
        <Grid cols={1} className="lg:grid-cols-12" gap="lg" align="stretch">
          {/* Text Content Column */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="mb-10">
              <span className="inline-block text-[#EF7C00] font-bold tracking-widest uppercase mb-3 text-sm md:text-base animate-in fade-in slide-in-from-bottom-4 duration-500">
                Why Choose Us
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both">
                Your Journey, <br />
                Our Commitment
              </h2>
            </div>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
              We go beyond just booking trips. We create experiences that
              transform how you see the world, with personalized service and
              attention to every detail.
            </p>

            {/* List with Vertical Accent Line */}
            <div className="relative pl-14 md:pl-16 flex flex-col gap-8">
              {/* Vertical Orange Dashed Line */}
              <div className="absolute left-[23px] top-6 bottom-6 border-l-2 border-dashed border-[#EF7C00]"></div>

              {/* Item 1 */}
              <div className="relative flex flex-col sm:flex-row items-start gap-4">
                <span className="w-12 h-12 rounded-full bg-[#EF7C00] text-white font-extrabold flex items-center justify-center text-lg shrink-0 z-10 select-none">
                  01
                </span>
                <div>
                  <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                    Personalized Tours Tailored to Your Dreams
                  </h4>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    Every journey is uniquely crafted to match your interests, budget, and travel style. Your perfect adventure awaits.
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="relative flex flex-col sm:flex-row items-start gap-4">
                <span className="w-12 h-12 rounded-full bg-[#EF7C00] text-white font-extrabold flex items-center justify-center text-lg shrink-0 z-10 select-none">
                  02
                </span>
                <div>
                  <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                    Expert Local Guides &amp; Support
                  </h4>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    Travel with confidence knowing our experienced team is with you every step of the way, 24/7.
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="relative flex flex-col sm:flex-row items-start gap-4">
                <span className="w-12 h-12 rounded-full bg-[#EF7C00] text-white font-extrabold flex items-center justify-center text-lg shrink-0 z-10 select-none">
                  03
                </span>
                <div>
                  <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                    Memories That Last Forever
                  </h4>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    We don&apos;t just plan trips, we create unforgettable moments and stories you&apos;ll cherish for a lifetime.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Image Column */}
          <div className="lg:col-span-5 py-6">
            <div className="relative w-full h-full min-h-[400px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white transition-all duration-500 hover:scale-[1.02]">
              <Image
                src={`${IMAGEKIT_URL_ENDPOINT}/assets/img/choose/Choose1.webp`}
                alt="Beautiful tour landscape in Pakistan"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </Grid>
      </Container>
    </Section>
  );
};

export default Choose;
