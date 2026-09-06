import React from "react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import Resume from "@/components/Sections/Resume";

const ResumePage = () => {
  return (
    <div className="relative min-h-screen bg-[#070A0D]">
      <Header />
      <main className="pt-16">
        <Resume />
      </main>
      <Footer />
    </div>
  );
};

export default ResumePage;
