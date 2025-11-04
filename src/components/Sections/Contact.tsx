import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, MapPin, Send, FileText, Youtube } from "lucide-react";
import Card from "../UI/Card";
import Button from "../UI/Button";
import { contactInfo } from "../../data/skills";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    
    // Since this is a static site, redirect to mailto
    const mailtoLink = `mailto:${contactInfo.email}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`)}`;
    window.location.href = mailtoLink;
    
    setStatus("success");
    setTimeout(() => setStatus("idle"), 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.section
      id="contact"
      className="section py-20 bg-gradient-to-b from-white to-primary-50"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-16" variants={itemVariants as any}>
          <h2 className="section-title text-center">
            Get in <span className="gradient-text">Touch</span>
          </h2>
          <p className="section-subtitle mt-4 mx-auto">
            Interested in collaboration or have questions? Feel free to reach out
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <Card className="p-8 h-full">
              <h3 className="text-2xl font-bold text-text-primary mb-6">
                Contact Information
              </h3>

              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <Mail className="text-primary-600 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <p className="font-semibold text-text-primary mb-1">Email</p>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-primary-600 hover:text-primary-700 break-all"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="text-primary-600 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <p className="font-semibold text-text-primary mb-1">Location</p>
                    <p className="text-text-secondary">{contactInfo.location}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-200">
                <h4 className="font-semibold text-text-primary mb-4">
                  Connect with me
                </h4>
                <div className="flex gap-4">
                  <a
                    href={contactInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-neutral-100 rounded-lg hover:bg-primary-100 hover:text-primary-600 transition-all"
                    aria-label="GitHub"
                  >
                    <Github size={24} />
                  </a>
                  <a
                    href={contactInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-neutral-100 rounded-lg hover:bg-primary-100 hover:text-primary-600 transition-all"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={24} />
                  </a>
                  <a
                    href={contactInfo.cv}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-neutral-100 rounded-lg hover:bg-primary-100 hover:text-primary-600 transition-all"
                    aria-label="Download CV"
                  >
                    <FileText size={24} />
                  </a>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div variants={itemVariants}>
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
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
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
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
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
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
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
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
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
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Contact;