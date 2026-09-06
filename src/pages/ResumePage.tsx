import React from "react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import Resume from "@/components/Sections/Resume";

const ResumePage = () => {
  return (
<<<<<<< HEAD
    <div className="relative min-h-screen bg-[#070A0D]">
=======
    <div className="relative min-h-screen overflow-x-clip bg-darkbg">
      {/* Background gradient overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(13,255,163,0.05)_0,rgba(0,0,0,0)_60%)]"></div>
      
>>>>>>> 4738555d5281ba89bdd2674124bd862d97d03e99
      <Header />
      <main className="pt-16">
        <Resume />
      </main>
      <Footer />
    </div>
  );
};

export default ResumePage;
