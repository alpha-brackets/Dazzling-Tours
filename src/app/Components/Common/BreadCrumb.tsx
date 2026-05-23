"use client";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadCrumbProps {
  Title: string;
  bgImg: string;
}

const BreadCrumb = ({ Title, bgImg }: BreadCrumbProps) => {
  return (
    <section
      className="relative w-full h-[350px] md:h-[450px] flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: bgImg ? `url('${bgImg}')` : undefined,
      }}
      suppressHydrationWarning
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-0"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center text-center mt-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 drop-shadow-lg tracking-tight">
            {Title}
          </h1>
          <Breadcrumb className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
            <BreadcrumbList className="text-white/90 sm:gap-3 text-sm md:text-base font-medium">
              <BreadcrumbItem>
                <BreadcrumbLink
                  render={<Link href="/" className="text-white hover:text-[#EF7C00] transition-colors flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z" /></svg> Home</Link>}
                />
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/60" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-[#EF7C00] font-bold">{Title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
    </section>
  );
};

export default BreadCrumb;
