
import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";
import ContactForm from "../UI/ContactForm";

const Contact: React.FC = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-16 max-w-xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
            Let's <span className="text-neon">work together</span>
          </h2>
          <p className="text-white/70">
            Have a project in mind? Let's discuss how I can help you bring your
            vision to life with innovative solutions.
          </p>
        </motion.div>
        
        <div className="grid gap-10 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="rounded-lg bg-darkcard/50 p-6 backdrop-blur-sm">
              <ContactForm />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neon/10">
                <Phone className="h-5 w-5 text-neon" />
              </div>
              <div>
                <h3 className="mb-1 text-lg font-semibold">Phone</h3>
                <p className="text-white/70">0381448741 / 0332658918</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neon/10">
                <Mail className="h-5 w-5 text-neon" />
              </div>
              <div>
                <h3 className="mb-1 text-lg font-semibold">Email</h3>
                <p className="text-white/70">tsinjonantosoa@gmail.com</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neon/10">
                <MapPin className="h-5 w-5 text-neon" />
              </div>
              <div>
                <h3 className="mb-1 text-lg font-semibold">Location</h3>
                <p className="text-white/70">
                  Antananarivo, Madagascar — Open to Remote
                </p>
              </div>
            </div>
            
            <div className="mt-10 rounded-lg bg-darkcard/50 p-6 backdrop-blur-sm">
              <h3 className="mb-3 text-lg font-semibold">Availability</h3>
              <p className="text-white/70">
                Open to remote AI engineering roles, AI automation projects, RAG systems,
                agentic applications, and selected freelance engagements.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
