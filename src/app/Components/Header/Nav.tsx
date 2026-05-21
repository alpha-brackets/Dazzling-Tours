"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavProps {
  setMobileToggle: (value: boolean) => void;
  isSticky?: boolean;
  isMobile?: boolean;
}

export default function Nav({ setMobileToggle, isMobile }: NavProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about-us", label: "About Us" },
    { href: "/tours", label: "Tours" },
    { href: "/blogs", label: "Blogs" },
    { href: "/contact", label: "Contact" },
  ];

  const handleLinkClick = () => {
    setMobileToggle(false);
  };

  if (isMobile) {
    return (
      <ul className="flex flex-col gap-3 text-lg font-semibold text-gray-800">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={handleLinkClick}
                className={`block py-2.5 px-4 rounded-xl transition-colors ${
                  isActive
                    ? "bg-[#EF7C00]/10 text-[#EF7C00] font-bold"
                    : "hover:bg-gray-50 hover:text-[#EF7C00]"
                }`}
                aria-label={`${item.label}`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
        <li className="mt-6 pt-6 border-t border-gray-100">
          <Link
            href="/contact"
            onClick={handleLinkClick}
            className="w-full text-center flex items-center justify-center gap-2 py-3.5 px-4 font-bold text-white bg-[#EF7C00] rounded-full transition-all hover:bg-[#d66e00] hover:scale-[1.01] shadow-sm active:scale-95"
            aria-label="Request A Quote"
          >
            Request A Quote
          </Link>
        </li>
      </ul>
    );
  }

  return (
    <ul className="flex items-center gap-8 font-medium">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={handleLinkClick}
              className={`text-sm font-semibold transition-all hover:text-white/80 ${
                isActive
                  ? "text-white underline decoration-2 underline-offset-8"
                  : "text-white"
              }`}
              aria-label={`${item.label}`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
