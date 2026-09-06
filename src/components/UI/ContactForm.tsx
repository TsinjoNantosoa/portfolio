import React, { useState } from "react";
import { Send } from "lucide-react";
import Button from "./Button";
import { toast } from "sonner";
import { EMAIL } from "@/data/experience";

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
    website: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceLabels: Record<string, string> = {
    "ai-agent": "AI Agent",
    "rag-assistant": "RAG / AI Assistant",
    automation: "Automation Workflow",
    "ai-backend": "AI Backend / API",
    "ai-product": "AI Product",
    other: "Other",
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.website) return;

    if (!isValidEmail(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        service: formData.service,
        serviceLabel: serviceLabels[formData.service] ?? formData.service,
        message: formData.message,
      };

      const apiUrl = import.meta.env.VITE_CONTACT_API_URL as string | undefined;
      let sentViaApi = false;

      if (apiUrl && !apiUrl.includes("localhost")) {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });
        sentViaApi = response.ok;
      }

      if (!sentViaApi) {
        const subject = encodeURIComponent(`Portfolio contact - ${payload.serviceLabel}`);
        const body = encodeURIComponent(
          [
            `Name: ${formData.name}`,
            `Email: ${formData.email}`,
            `Service: ${payload.serviceLabel}`,
            "",
            "Message:",
            formData.message,
          ].join("\n")
        );
        window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
        toast.success("Email app opened. Please confirm sending your message.");
      } else {
        toast.success("Message sent successfully. I'll get back to you soon.");
      }

      setFormData({ name: "", email: "", service: "", message: "", website: "" });
    } catch {
      toast.error("Unable to send right now. Please email me directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass =
    "w-full rounded-md border border-white/10 bg-[var(--surface-2)] px-4 py-3 text-[15px] text-white placeholder-white/40 focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon";

  return (
<<<<<<< HEAD
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
=======
    <form onSubmit={handleSubmit} className="min-w-0 space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
>>>>>>> 4738555d5281ba89bdd2674124bd862d97d03e99
        <input
          id="website"
          type="text"
          name="website"
          value={formData.website}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm text-[var(--text-secondary)]">
          Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm text-[var(--text-secondary)]">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="service" className="mb-1.5 block text-sm text-[var(--text-secondary)]">
          What are you building?
        </label>
        <select
          id="service"
          name="service"
          value={formData.service}
          onChange={handleChange}
          required
          className={fieldClass}
        >
          <option value="" disabled>
            Select an option
          </option>
          <option value="ai-agent">AI Agent</option>
          <option value="rag-assistant">RAG / AI Assistant</option>
          <option value="automation">Automation Workflow</option>
          <option value="ai-backend">AI Backend / API</option>
          <option value="ai-product">AI Product</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm text-[var(--text-secondary)]">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className={fieldClass}
        />
      </div>

      <Button
        type="submit"
<<<<<<< HEAD
        className="flex min-h-11 items-center gap-2 rounded-full bg-neon px-6 py-3 text-black transition hover:bg-neon/90"
=======
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-neon px-6 py-3 text-black transition-all hover:shadow-[0_0_15px_rgba(13,255,163,0.6)] sm:w-auto"
>>>>>>> 4738555d5281ba89bdd2674124bd862d97d03e99
        disabled={isSubmitting}
        isLoading={isSubmitting}
      >
        <Send size={16} />
        Send message
      </Button>
    </form>
  );
};

export default ContactForm;
