
import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-darkbg py-8">
      <div className="container mx-auto px-4 text-center text-white/50 md:px-6 lg:px-8">
        <p>
          &copy; {new Date().getFullYear()} Sandaniaina Tsinjo Nantosoa. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
