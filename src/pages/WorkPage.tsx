import React from "react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import Projects from "@/components/Sections/Projects";

const WorkPage = () => {
  return (
    <div className="relative min-h-screen bg-[#070A0D]">
      <Header />
      <main className="pt-16">
        <Projects />
      </main>
      <Footer />
    </div>
  );
};

export default WorkPage;
