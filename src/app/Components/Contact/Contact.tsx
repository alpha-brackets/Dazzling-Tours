"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCreateContactInquiry, useNotification } from "@/lib/hooks";
import { Section, Container, Grid } from "@/app/Components/Common";
import { TextInput, Textarea, Select } from "@/app/Components/Form";
import { ContactGroupType, getContactGroupTypes } from "@/lib/types/enums";
import { MapPin, Phone, Send, Minus, Plus } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants/companyInfo";

const Contact = () => {
  const [activeTab, setActiveTab] = useState<"general" | "custom">("general");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

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

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCustomInputChange = (name: string, value: string | number) => {
    setCustomData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createContactMutation.mutate(formData, {
      onSuccess: () => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        showSuccess("Thank you! Your message has been sent successfully.");
      },
    });
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createContactMutation.mutate({
      name: customData.name,
      email: customData.email,
      phone: customData.phone,
      subject: "Custom Tour Query",
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
    <div>
      {/* Contact Info Cards */}
      <Section padding="lg" className="contact-us-section fix bg-gray-50">
        <Container>
          <Grid cols={2} gap="lg" className="max-w-4xl mx-auto">
            {/* Address Card */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden">
              <div className="p-8 flex flex-col items-center text-center">
                <div className="bg-[#EF7C00]/10 text-[#EF7C00] w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Our Address</h3>
                <p className="text-gray-500 text-sm">
                  Discover our welcoming office spaces <br />
                  for your perfect adventure.
                </p>
              </div>
            </div>

            {/* Phone Card */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden">
              <div className="p-8 flex flex-col items-center text-center">
                <div className="bg-[#EF7C00]/10 text-[#EF7C00] w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Phone className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  <a href={`tel:${COMPANY_INFO.phone.link}`} className="hover:text-[#EF7C00] transition-colors">
                    {COMPANY_INFO.phone.display}
                  </a>
                </h3>
                <p className="text-gray-500 text-sm">
                  Call us anytime for instant support, <br />
                  we are waiting for your call.
                </p>
              </div>
            </div>
          </Grid>
        </Container>
      </Section>

      {/* Contact Form and Map */}
      <Section padding="lg" className="contact-us-section-2 fix">
        <Container>
          <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
            <Grid cols={1} className="lg:grid-cols-2 items-stretch">
              {/* Form Side */}
              <div className="p-8 lg:p-12">
                {/* Tabs */}
                <div className="flex border-b border-gray-100 mb-8 gap-4">
                  <button
                    type="button"
                    className={`pb-4 text-base md:text-lg font-bold border-b-2 transition-all cursor-pointer ${
                      activeTab === "general"
                        ? "border-[#EF7C00] text-[#EF7C00]"
                        : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}
                    onClick={() => setActiveTab("general")}
                  >
                    General Inquiry
                  </button>
                  <button
                    type="button"
                    className={`pb-4 text-base md:text-lg font-bold border-b-2 transition-all cursor-pointer ${
                      activeTab === "custom"
                        ? "border-[#EF7C00] text-[#EF7C00]"
                        : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}
                    onClick={() => setActiveTab("custom")}
                  >
                    Plan a Custom Tour
                  </button>
                </div>

                {activeTab === "general" ? (
                  <>
                    <div className="mb-6 flex flex-col gap-1">
                      <span className="text-[#EF7C00] font-heading font-medium uppercase tracking-wider text-sm md:text-base">
                        Contact us
                      </span>
                      <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
                        Send Message Anytime
                      </h2>
                      <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                        We&apos;d love to hear from you. Fill out the form below
                        and our team will get back to you immediately.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                      <Grid cols={1} className="md:grid-cols-2" gap="md">
                        <TextInput
                          label="Your Name"
                          name="name"
                          placeholder="Enter your name"
                          value={formData.name}
                          onChange={(value) => handleInputChange("name", value)}
                          required
                        />
                        <TextInput
                          label="Your Email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(value) => handleInputChange("email", value)}
                          required
                        />
                      </Grid>

                      <Grid cols={1} className="md:grid-cols-2" gap="md">
                        <TextInput
                          label="Phone Number"
                          name="phone"
                          type="tel"
                          placeholder="Enter phone number"
                          value={formData.phone}
                          onChange={(value) => handleInputChange("phone", value)}
                          required
                        />
                        <TextInput
                          label="Subject"
                          name="subject"
                          placeholder="Enter subject"
                          value={formData.subject}
                          onChange={(value) => handleInputChange("subject", value)}
                          required
                        />
                      </Grid>

                      <Textarea
                        label="Your Message"
                        name="message"
                        placeholder="Type your message here..."
                        rows={5}
                        value={formData.message}
                        onChange={(value) => handleInputChange("message", value)}
                        required
                      />

                      <Button
                        type="submit"
                        className="w-full mt-2 bg-[#EF7C00] hover:bg-[#D96E00] text-white font-bold py-6 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                        disabled={createContactMutation.isPending}
                      >
                        {createContactMutation.isPending ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                            Sending Securely...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </>
                ) : (
                  <>
                    <div className="mb-6 flex flex-col gap-1">
                      <span className="text-[#EF7C00] font-heading font-medium uppercase tracking-wider text-sm md:text-base">
                        Customize Tour
                      </span>
                      <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
                        Build Your Dream Tour
                      </h2>
                      <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                        Tell us about your travel plans, destinations, group size, and hotel rooms, and we&apos;ll draft the perfect custom itinerary for you.
                      </p>
                    </div>

                    <form onSubmit={handleCustomSubmit} className="flex flex-col gap-4">
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
                        className="w-full mt-2 bg-[#EF7C00] hover:bg-[#D96E00] text-white font-bold py-6 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
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
                  </>
                )}
              </div>

              {/* Map Side */}
              <div className="min-h-[400px] lg:h-full w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106263.29267923702!2d72.98687275000001!3d33.61625095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfbfd07891722f%3A0x6059515c3bdb02b6!2sIslamabad%2C%20Islamabad%20Capital%20Territory%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                  loading="lazy"
                  className="w-full h-full border-0"
                  style={{ minHeight: "100%", display: "block" }}
                  title="Google Map"
                ></iframe>
              </div>
            </Grid>
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default Contact;
