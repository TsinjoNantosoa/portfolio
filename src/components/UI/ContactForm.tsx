import React, { FormEvent, useState } from "react";
import { toast } from "sonner";
import { EMAIL } from "@/data/experience";

const PROJECT_TYPES = [
  "AI Agent",
  "RAG / AI Assistant",
  "Automation Workflow",
  "AI Backend / API",
  "AI Product",
  "Other",
] as const;

type FieldErrors = {
  name?: string;
  email?: string;
  projectType?: string;
  message?: string;
};

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const ContactForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = "Name is required.";
    if (!email.trim()) next.email = "Email is required.";
    else if (!isValidEmail(email)) next.email = "Enter a valid email.";
    if (!projectType) next.projectType = "Select what you are building.";
    if (!message.trim()) next.message = "Message is required.";
    return next;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (website.trim()) return;

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);

    const apiUrl = import.meta.env.VITE_CONTACT_API_URL?.trim();
    const useApi =
      Boolean(apiUrl) &&
      !apiUrl.includes("localhost") &&
      !apiUrl.includes("127.0.0.1");

    try {
      if (useApi && apiUrl) {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            projectType,
            message: message.trim(),
          }),
        });

        if (!response.ok) {
          throw new Error(`API error ${response.status}`);
        }

        toast.success("Message sent successfully.");
        setName("");
        setEmail("");
        setProjectType("");
        setMessage("");
        setErrors({});
      } else {
        const subject = encodeURIComponent(
          `Portfolio contact — ${projectType || "AI project"}`
        );
        const body = encodeURIComponent(
          `Name: ${name.trim()}\nEmail: ${email.trim()}\nWhat are you building?: ${projectType}\n\n${message.trim()}`
        );
        window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
        toast.message(
          "Email draft opened. Please send it from your email app."
        );
      }
    } catch {
      toast.error("Could not send via form. Email me directly.", {
        action: {
          label: "Email me directly",
          onClick: () => {
            window.location.href = `mailto:${EMAIL}`;
          },
        },
      });
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass =
    "w-full min-h-12 rounded-lg border border-white/15 bg-[var(--surface-2)] px-3.5 py-2.5 text-[15.5px] text-[var(--text-primary)] outline-none transition placeholder:text-white/30 hover:border-white/25 focus:border-neon/60 focus:ring-1 focus:ring-neon/30";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm text-white/65">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={fieldClass}
          />
          {errors.name && (
            <p id="name-error" className="mt-1.5 text-sm text-red-400">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm text-white/65">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={fieldClass}
          />
          {errors.email && (
            <p id="email-error" className="mt-1.5 text-sm text-red-400">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="projectType"
          className="mb-1.5 block text-sm text-white/65"
        >
          What are you building?
        </label>
        <select
          id="projectType"
          name="projectType"
          required
          value={projectType}
          onChange={(e) => setProjectType(e.target.value)}
          aria-invalid={Boolean(errors.projectType)}
          aria-describedby={errors.projectType ? "projectType-error" : undefined}
          className={fieldClass}
        >
          <option value="">Select an option</option>
          {PROJECT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.projectType && (
          <p id="projectType-error" className="mt-1.5 text-sm text-red-400">
            {errors.projectType}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm text-white/65">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`${fieldClass} min-h-[120px] resize-y`}
        />
        {errors.message && (
          <p id="message-error" className="mt-1.5 text-sm text-red-400">
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn-neon min-h-11 w-full sm:w-auto disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
};

export default ContactForm;
