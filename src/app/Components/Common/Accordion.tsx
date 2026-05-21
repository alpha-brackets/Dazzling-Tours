"use client";
import React from "react";
import {
  Accordion as ShadcnAccordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface AccordionItemData {
  title: React.ReactNode;
  content: React.ReactNode;
  id?: string;
}

export interface AccordionProps {
  items: AccordionItemData[];
  defaultOpenIndex?: number;
  allowMultiple?: boolean;
  className?: string;
}

const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpenIndex = 0,
  allowMultiple = false,
  className = "",
}) => {
  // Map defaultOpenIndex to defaultValue string/array
  const defaultValue = allowMultiple
    ? defaultOpenIndex !== undefined ? [`item-${defaultOpenIndex}`] : []
    : defaultOpenIndex !== undefined ? `item-${defaultOpenIndex}` : undefined;

  return (
    <ShadcnAccordion
      // @ts-expect-error - type prop might not be recognized by Base UI types in this setup
      type={allowMultiple ? "multiple" : "single"}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      defaultValue={defaultValue as any}
      className={`accordion-container w-full ${className}`}
    >
      {items.map((item, index) => {
        const value = item.id || `item-${index}`;
        return (
          <AccordionItem key={value} value={value} className="border border-gray-100 rounded-xl mb-3 overflow-hidden bg-white shadow-sm data-[state=open]:shadow-md transition-shadow">
            <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 transition-colors text-left font-semibold text-[#2c3e50]">
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="px-4 py-3 bg-white text-gray-700 text-base">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </ShadcnAccordion>
  );
};

export default Accordion;
