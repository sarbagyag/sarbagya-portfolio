"use client";

import React, { useState } from "react";
import { Mail, Github, Linkedin, MapPin, Send, FileText } from "lucide-react";
import Card from "../UI/Card";
import Button from "../UI/Button";
import { submitContactMessage } from "../../app/contact/actions";
import type { profile as profileTable } from "@/db/schema";

type Profile = typeof profileTable.$inferSelect;

const Contact: React.FC<{ profile: Profile }> = ({ profile }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const result = await submitContactMessage(formData);

    if (result.success) {
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 3000);
    } else {
      setStatus("error");
      setErrorMessage(result.error ?? "Something went wrong. Please try again.");
    }
  };

  return (
    <section id="contact" className="section py-20 bg-gradient-to-b from-bg-primary to-link-subtle">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title text-center">
            Get in <span className="gradient-text">Touch</span>
          </h2>
          <p className="section-subtitle mt-4 mx-auto">
            Interested in collaboration or have questions? Feel free to reach out
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <Card className="p-8 h-full">
              <h3 className="text-2xl font-bold text-text-primary mb-6">
                Contact Information
              </h3>

              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <Mail className="text-link mt-1 flex-shrink-0" size={24} />
                  <div>
                    <p className="font-semibold text-text-primary mb-1">Email</p>
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-link hover:text-link-hover break-all"
                    >
                      {profile.email}
                    </a>
                  </div>
                </div>

                {profile.location && (
                  <div className="flex items-start gap-4">
                    <MapPin className="text-link mt-1 flex-shrink-0" size={24} />
                    <div>
                      <p className="font-semibold text-text-primary mb-1">Location</p>
                      <p className="text-text-secondary">{profile.location}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-border-color">
                <h4 className="font-semibold text-text-primary mb-4">
                  Connect with me
                </h4>
                <div className="flex gap-4">
                  {profile.githubUrl && (
                    <a
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-bg-secondary rounded-lg hover:bg-link-subtle-hover hover:text-link transition-all"
                      aria-label="GitHub"
                    >
                      <Github size={24} />
                    </a>
                  )}
                  {profile.linkedinUrl && (
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-bg-secondary rounded-lg hover:bg-link-subtle-hover hover:text-link transition-all"
                      aria-label="LinkedIn"
                    >
                      <Linkedin size={24} />
                    </a>
                  )}
                  {profile.resumeUrl && (
                    <a
                      href={profile.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-bg-secondary rounded-lg hover:bg-link-subtle-hover hover:text-link transition-all"
                      aria-label="Download CV"
                    >
                      <FileText size={24} />
                    </a>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-text-primary mb-2"
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-text-primary mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-semibold text-text-primary mb-2"
                  >
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-text-primary mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                    placeholder="Your message..."
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  loading={status === "sending"}
                  disabled={status === "sending"}
                  icon={<Send size={20} />}
                >
                  {status === "sending"
                    ? "Sending..."
                    : status === "success"
                      ? "Sent!"
                      : "Send Message"}
                </Button>
                {status === "error" && (
                  <p className="text-sm text-carbon-support-error text-center">{errorMessage}</p>
                )}
              </form>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;