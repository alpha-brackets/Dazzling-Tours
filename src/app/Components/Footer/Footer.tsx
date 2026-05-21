"use client";
import { IMAGEKIT_URL_ENDPOINT } from "@/lib/utils/imageUtils";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "../Common";
import { SOCIAL_LINKS } from "@/lib/constants/socials";
import { COMPANY_INFO } from "@/lib/constants/companyInfo";
import Icon from "@/app/Components/Common/Icon";

const Footer = () => {
  return (
    <footer className="w-full flex flex-col" suppressHydrationWarning>
      {/* Upper Footer section */}
      <div className="w-full flex flex-col lg:flex-row bg-[#0A0A0A]">
        {/* Left Sidebar Column (1/3 Width) */}
        <div className="w-full lg:w-1/3 py-16 px-8 md:px-12 flex flex-col items-center lg:items-start justify-center border-b lg:border-b-0 lg:border-r border-white/5">
          <div className="mb-6">
            <Link href="/" className="flex justify-center lg:justify-start">
              <Image
                src={`${IMAGEKIT_URL_ENDPOINT}/assets/img/logo-dazzling/Logo_Black.png`}
                alt="Dazzling Tours"
                width={220}
                height={75}
                className="h-16 w-auto object-contain brightness-0 invert"
                priority
              />
            </Link>
          </div>

          <p className="text-sm text-center lg:text-left text-gray-300 max-w-sm mb-6 leading-relaxed">
            We craft tailor-made travel packages for groups, couples, and families across the most stunning locations in Pakistan.
          </p>

          <div className="flex items-center gap-4 text-xl">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="bg-white/5 hover:bg-[#EF7C00] text-gray-200 hover:text-white hover:scale-105 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
              >
                <Icon name={social.iconName} size={18} />
              </a>
            ))}
          </div>
        </div>

        <div
          className="w-full lg:w-2/3 relative py-16 px-8 md:px-16 text-gray-300"
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-[#EF7C00]/5 z-0 pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Quick Links Column */}
            <div>
              <div className="mb-6 relative">
                <h4 className="text-lg font-bold text-white tracking-wider uppercase font-sans">Quick Links</h4>
                <div className="w-12 h-1 bg-[#EF7C00] mt-2 rounded-full"></div>
              </div>
              <ul className="flex flex-col gap-3 text-sm">
                {[
                  { name: 'Home', href: '/' },
                  { name: 'About Us', href: '/about-us' },
                  { name: 'Blogs', href: '/blogs' },
                  { name: 'Tours', href: '/tours' },
                  { name: 'Contact', href: '/contact' },
                  { name: 'Admin', href: '/admin' },
                ].map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-300 hover:text-[#EF7C00] transition-colors duration-200">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Us Column */}
            <div>
              <div className="mb-6 relative">
                <h4 className="text-lg font-bold text-white tracking-wider uppercase font-sans">Contact Us</h4>
                <div className="w-12 h-1 bg-[#EF7C00] mt-2 rounded-full"></div>
              </div>
              <div className="flex flex-col gap-4 text-sm">
                {[
                  // {
                  //   id: 'email',
                  //   icon: 'envelope-fill',
                  //   title: 'Email Us',
                  //   href: `mailto:${COMPANY_INFO.email}`,
                  //   display: COMPANY_INFO.email
                  // },
                  {
                    id: 'phone',
                    icon: 'telephone-fill',
                    title: 'Call Us',
                    href: `tel:${COMPANY_INFO.phone.link}`,
                    display: COMPANY_INFO.phone.display
                  }
                ].map((info) => (
                  <div key={info.id} className="flex items-center gap-4 group cursor-pointer">
                    <div className="text-[#EF7C00] bg-white/5 border border-white/10 p-3 rounded-xl group-hover:bg-[#EF7C00] group-hover:text-white transition-all duration-300">
                      <Icon name={info.icon} size={18} />
                    </div>
                    <div>
                      <h5 className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5 font-sans">{info.title}</h5>
                      <a href={info.href} className="text-gray-200 group-hover:text-[#EF7C00] transition-colors duration-200 font-medium">
                        {info.display}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar (Pure Black) */}
      <div className="w-full bg-black py-6 border-t border-white/5 text-sm text-gray-400 relative z-10">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left px-4">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <p>
                Copyright © <span className="text-white font-medium">Dazzling Tours</span>. All Rights Reserved.
              </p>
              <span className="hidden sm:inline text-gray-800">|</span>
              <p className="flex items-center gap-1.5 justify-center">
                Made with{" "}
                <span className="text-red-500">
                  <Icon name="heart-fill" size={12} color="red" />
                </span>{" "}
                by{" "}
                <a
                  href="https://www.alphabrackets.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#EF7C00] transition-colors font-medium"
                >
                  Alpha Brackets
                </a>
              </p>
            </div>
            <div className="flex gap-6">
              <Link
                href="/terms-and-conditions"
                target="_blank"
                className="hover:text-white transition-colors duration-200"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/privacy-policy"
                target="_blank"
                className="hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
