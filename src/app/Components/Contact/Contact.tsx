"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCreateContactInquiry, useNotification } from "@/lib/hooks";
import { Section, Container, Grid } from "@/app/Components/Common";
import { TextInput, Textarea } from "@/app/Components/Form";
import { MapPin, Phone, Send } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants/companyInfo";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
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
                    className="w-full mt-2 bg-[#EF7C00] hover:bg-[#D96E00] text-white font-bold py-6 rounded-lg flex items-center justify-center gap-2"
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
