"use client";
import React from "react";
import { COMPANY_INFO } from "@/lib/constants/companyInfo";

const WhatsAppAffix = () => {
  const whatsappUrl = `https://wa.me/${COMPANY_INFO.whatsapp.number}?text=${encodeURIComponent(COMPANY_INFO.whatsapp.defaultMessage)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with us on WhatsApp: ${COMPANY_INFO.whatsapp.display}`}
      title={`WhatsApp: ${COMPANY_INFO.whatsapp.display}`}
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-700 fill-mode-both"
    >
      {/* Tooltip label — slides in on hover */}
      <div className="flex flex-col items-end overflow-hidden max-w-0 group-hover:max-w-[200px] transition-all duration-300 ease-in-out">
        <span className="bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap border border-gray-100">
          Chat on WhatsApp
        </span>
        <span className="text-white text-[10px] bg-[#25D366] px-2 py-0.5 rounded-full mt-1 whitespace-nowrap">
          {COMPANY_INFO.whatsapp.display}
        </span>
      </div>

      {/* The button itself */}
      <div className="relative shrink-0">
        {/* Pulse ring — runs 5 times then stops */}
        <span
          className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-60"
          style={{ animationIterationCount: 5 }}
        />
        <div className="relative w-14 h-14 rounded-full bg-[#25D366] shadow-lg hover:bg-[#20b858] hover:scale-110 transition-all duration-300 flex items-center justify-center">
          {/* WhatsApp SVG icon */}
          <svg
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 fill-white"
            aria-hidden="true"
          >
            <path d="M16.003 2.667C8.638 2.667 2.667 8.638 2.667 16c0 2.365.635 4.666 1.84 6.678L2.667 29.333l6.848-1.797A13.29 13.29 0 0 0 16.003 29.334c7.365 0 13.333-5.971 13.333-13.334S23.368 2.667 16.003 2.667zm0 24c-2.118 0-4.197-.57-6.015-1.65l-.43-.255-4.063 1.067 1.084-3.955-.28-.454A10.617 10.617 0 0 1 5.334 16c0-5.883 4.786-10.667 10.669-10.667S26.67 10.117 26.67 16 21.886 26.667 16.003 26.667zm5.848-7.987c-.32-.16-1.896-.936-2.19-1.042-.294-.107-.507-.16-.72.16-.214.32-.829 1.042-1.016 1.256-.187.214-.373.24-.694.08-.32-.16-1.35-.498-2.573-1.588-.951-.85-1.593-1.898-1.78-2.219-.187-.32-.02-.493.14-.652.145-.144.32-.373.48-.56.16-.186.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.736-.987-2.378-.26-.624-.523-.54-.72-.55-.186-.008-.4-.01-.614-.01s-.56.08-.853.4c-.293.32-1.12 1.096-1.12 2.672s1.147 3.1 1.307 3.314c.16.213 2.256 3.446 5.468 4.832.764.33 1.36.527 1.824.674.767.244 1.465.21 2.016.127.615-.092 1.896-.776 2.163-1.525.267-.75.267-1.392.187-1.526-.08-.133-.293-.213-.614-.373z" />
          </svg>
        </div>
      </div>
    </a>
  );
};

export default WhatsAppAffix;
