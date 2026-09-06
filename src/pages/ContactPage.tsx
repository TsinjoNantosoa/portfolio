import React from "react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import Contact from "@/components/Sections/Contact";

const ContactPage = () => {
  return (
    <div className="relative min-h-screen bg-[#070A0D]">
      <Header />
      <main className="pt-16">
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
