"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCreateContactInquiry, useNotification } from "@/lib/hooks";
import { Section, Container, Grid } from "@/app/Components/Common";
import { TextInput, Textarea, Select } from "@/app/Components/Form";
import { ContactGroupType, getContactGroupTypes } from "@/lib/types/enums";
import { Minus, Plus, Send, Sparkles, Map, Compass, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { IMAGEKIT_URL_ENDPOINT } from "@/lib/utils/imageUtils";

const CustomTourSection = () => {
  const [customData, setCustomData] = useState({
    name: "",
    email: "",
    phone: "",
    departureCity: "",
    placesToVisit: "",
    groupType: ContactGroupType.INDIVIDUAL,
    travelDate: "",
    numberOfDays: 1,
    participants: 1,
    numberOfRooms: 1,
    message: "",
  });

  const createContactMutation = useCreateContactInquiry();
  const { showSuccess } = useNotification();

  const handleCustomInputChange = (name: string, value: string | number) => {
    setCustomData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createContactMutation.mutate({
      name: customData.name,
      email: customData.email,
      phone: customData.phone,
      subject: "Custom Tour Query from Homepage",
      message: customData.message,
      startDate: customData.travelDate || undefined,
      participants: Number(customData.participants),
      groupType: customData.groupType,
      numberOfDays: Number(customData.numberOfDays),
      numberOfRooms: Number(customData.numberOfRooms),
      departureCity: customData.departureCity,
      placesToVisit: customData.placesToVisit,
    }, {
      onSuccess: () => {
        setCustomData({
          name: "",
          email: "",
          phone: "",
          departureCity: "",
          placesToVisit: "",
          groupType: ContactGroupType.INDIVIDUAL,
          travelDate: "",
          numberOfDays: 1,
          participants: 1,
          numberOfRooms: 1,
          message: "",
        });
        showSuccess("Your custom tour request has been submitted successfully!");
      },
    });
  };

  return (
    <Section padding="lg" className="homepage-custom-tour-section fix bg-gray-50/50 border-t border-b border-gray-100">
      <Container>
        <Grid cols={1} className="lg:grid-cols-12 items-stretch" gap="xl">
          
          {/* Information & Feature Column (Left) */}
          <div className="lg:col-span-5 flex flex-col justify-between py-2">
            <div>
              {/* Animated Subtitle */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EF7C00]/10 border border-[#EF7C00]/25 mb-6">
                <Sparkles className="h-4 w-4 text-[#EF7C00] animate-pulse" />
                <span className="text-[#EF7C00] text-xs md:text-sm font-extrabold tracking-wider uppercase">
                  Tailored Travel Planner
                </span>
              </div>

              {/* Title */}
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                Bespoke Adventures <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EF7C00] to-yellow-500">
                  Designed For You
                </span>
              </h2>

              <p className="text-gray-600 leading-relaxed mb-8 text-base md:text-lg">
                Can&apos;t find exactly what you are looking for? Our experienced travel consultants are here to design a custom tour tailored specifically to your needs. Fill out your requirements, and we will craft the perfect itinerary!
              </p>

              {/* Value Props */}
              <div className="flex flex-col gap-6 mb-8 lg:mb-0">
                <div className="flex items-start gap-4">
                  <div className="bg-[#EF7C00]/10 p-3 rounded-2xl text-[#EF7C00] flex-shrink-0">
                    <Map className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">Unmatched Freedom</h4>
                    <p className="text-sm text-gray-500">Choose your start dates, destinations, pace, and activities with complete flexibility.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#EF7C00]/10 p-3 rounded-2xl text-[#EF7C00] flex-shrink-0">
                    <Compass className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">Handpicked Accommodations</h4>
                    <p className="text-sm text-gray-500">From luxury resorts to cozy boutique homestays, stay exactly where you desire.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#EF7C00]/10 p-3 rounded-2xl text-[#EF7C00] flex-shrink-0">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">Verified Local Experts</h4>
                    <p className="text-sm text-gray-500">Benefit from 24/7 support and local guides who know Pakistan inside out.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Callout Box */}
            <div className="hidden lg:block relative h-48 w-full rounded-2xl overflow-hidden shadow-md mt-6">
              <Image
                src={`${IMAGEKIT_URL_ENDPOINT}/assets/img/cta/mountain-trip-family.jpg`}
                alt="Custom travel experience Pakistan"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#EF7C00]">Exclusive Experiences</span>
                <h5 className="font-bold text-lg leading-tight mt-1">Make your dream vacation a reality</h5>
              </div>
            </div>
          </div>

          {/* Form Column (Right) */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 relative overflow-hidden">
              {/* Highlight Bar */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#EF7C00] to-yellow-500" />
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 leading-tight">Customize Your Tour</h3>
                <p className="text-sm text-gray-500 mt-1">Provide your details and preferences to start building your custom plan.</p>
              </div>

              <form onSubmit={handleCustomSubmit} className="flex flex-col gap-5">
                <Grid cols={1} className="md:grid-cols-2" gap="md">
                  <TextInput
                    label="Your Name"
                    name="name"
                    placeholder="Enter your name"
                    value={customData.name}
                    onChange={(value) => handleCustomInputChange("name", value)}
                    required
                  />
                  <TextInput
                    label="Your Email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={customData.email}
                    onChange={(value) => handleCustomInputChange("email", value)}
                    required
                  />
                </Grid>

                <Grid cols={1} className="md:grid-cols-2" gap="md">
                  <TextInput
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={customData.phone}
                    onChange={(value) => handleCustomInputChange("phone", value)}
                    required
                  />
                  <TextInput
                    label="Departure City"
                    name="departureCity"
                    placeholder="City you want to start from"
                    value={customData.departureCity}
                    onChange={(value) => handleCustomInputChange("departureCity", value)}
                  />
                </Grid>

                <Grid cols={1} className="md:grid-cols-2" gap="md">
                  <TextInput
                    label="Places to Visit"
                    name="placesToVisit"
                    placeholder="E.g. Hunza, Skardu, Naran"
                    value={customData.placesToVisit}
                    onChange={(value) => handleCustomInputChange("placesToVisit", value)}
                  />
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-sm font-medium text-gray-700">Travel Date</label>
                    <input
                      type="date"
                      className="w-full px-3 h-10 border border-input bg-transparent rounded-lg focus:ring-2 focus:ring-[#EF7C00] focus:border-transparent outline-none transition-all text-gray-700 text-sm"
                      value={customData.travelDate}
                      onChange={(e) => handleCustomInputChange("travelDate", e.target.value)}
                    />
                  </div>
                </Grid>

                {/* Counters */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2 block ml-1">Persons</label>
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg h-10">
                      <button type="button" className="px-3 text-gray-500 hover:text-[#EF7C00] cursor-pointer" onClick={() => handleCustomInputChange("participants", Math.max(1, (Number(customData.participants) || 0) - 1))}><Minus className="h-3 w-3" /></button>
                      <input type="number" className="w-full bg-transparent text-center font-bold outline-none border-0 text-sm" value={customData.participants} readOnly />
                      <button type="button" className="px-3 text-gray-500 hover:text-[#EF7C00] cursor-pointer" onClick={() => handleCustomInputChange("participants", (Number(customData.participants) || 0) + 1)}><Plus className="h-3 w-3" /></button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2 block ml-1">Days</label>
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg h-10">
                      <button type="button" className="px-3 text-gray-500 hover:text-[#EF7C00] cursor-pointer" onClick={() => handleCustomInputChange("numberOfDays", Math.max(1, (Number(customData.numberOfDays) || 0) - 1))}><Minus className="h-3 w-3" /></button>
                      <input type="number" className="w-full bg-transparent text-center font-bold outline-none border-0 text-sm" value={customData.numberOfDays} readOnly />
                      <button type="button" className="px-3 text-gray-500 hover:text-[#EF7C00] cursor-pointer" onClick={() => handleCustomInputChange("numberOfDays", (Number(customData.numberOfDays) || 0) + 1)}><Plus className="h-3 w-3" /></button>
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2 block ml-1">Rooms</label>
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg h-10">
                      <button type="button" className="px-3 text-gray-500 hover:text-[#EF7C00] cursor-pointer" onClick={() => handleCustomInputChange("numberOfRooms", Math.max(1, (Number(customData.numberOfRooms) || 0) - 1))}><Minus className="h-3 w-3" /></button>
                      <input type="number" className="w-full bg-transparent text-center font-bold outline-none border-0 text-sm" value={customData.numberOfRooms} readOnly />
                      <button type="button" className="px-3 text-gray-500 hover:text-[#EF7C00] cursor-pointer" onClick={() => handleCustomInputChange("numberOfRooms", (Number(customData.numberOfRooms) || 0) + 1)}><Plus className="h-3 w-3" /></button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Select
                      label="Group Type"
                      placeholder="Select Group Type"
                      value={customData.groupType}
                      onChange={(val) => handleCustomInputChange("groupType", val)}
                      data={getContactGroupTypes()}
                    />
                  </div>
                </div>

                <Textarea
                  label="Special Requests / Custom Itinerary Notes"
                  name="message"
                  placeholder="Tell us about specific sights, budget, transport type, or hotel preference..."
                  rows={4}
                  value={customData.message}
                  onChange={(value) => handleCustomInputChange("message", value)}
                  required
                />

                <Button
                  type="submit"
                  className="w-full mt-2 bg-[#EF7C00] hover:bg-[#D96E00] text-white font-bold py-6 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#EF7C00]/10 transition-all hover:-translate-y-0.5 active:translate-y-0"
                  disabled={createContactMutation.isPending}
                >
                  {createContactMutation.isPending ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Submitting Request...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Custom Tour Request
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

        </Grid>
      </Container>
    </Section>
  );
};

export default CustomTourSection;
