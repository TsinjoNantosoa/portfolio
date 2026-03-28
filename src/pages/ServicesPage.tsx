
import React from "react";
import Header from "@/components/Layout/Header";
import Services from "@/components/Sections/Services";

const ServicesPage = () => {
  return (
    <div className="relative min-h-screen bg-darkbg">
      {/* Background gradient overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(13,255,163,0.05)_0,rgba(0,0,0,0)_60%)]"></div>
      
      <Header />
      
      <main className="pt-20">
        <Services />
      </main>
      
      <footer className="border-t border-white/10 bg-darkbg py-8">
        <div className="container mx-auto px-4 text-center text-white/50 md:px-6 lg:px-8">
          <p>
            &copy; {new Date().getFullYear()} Sandaniaina Tsinjo Nantosoa. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ServicesPage;
