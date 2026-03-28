
import React from "react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import Contact from "@/components/Sections/Contact";

const ContactPage = () => {
  return (
    <div className="relative min-h-screen bg-darkbg">
      {/* Background gradient overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(13,255,163,0.05)_0,rgba(0,0,0,0)_60%)]"></div>
      
      <Header />
      
      <main className="pt-20">
        <Contact />
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactPage;
