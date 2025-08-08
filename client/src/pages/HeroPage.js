import React from 'react';
import Navbar from '../components/Navbar';
import WhoAmI from '../components/WhoAmI';
import HeroImage from '../components/HeroImage';
import Projects from '../components/Projects';
import Description from '../components/Description';
import Contact from '../components/Contact';
import SocialMedia from '../components/SocialMedia';

function HeroPage() {
  return (
    <>
      <Navbar />
      <div className="pt-24">
        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="flex justify-start mx-4 mt-0 gap-4">
            <div className="flex flex-col gap-4">
              <WhoAmI />
            </div>
            <div className="flex flex-col gap-4">
              <HeroImage />
            </div>
            <div className="flex flex-col gap-4">
              <Projects />
              <SocialMedia />
            </div>
          </div>
          <div className="flex justify-start mx-4 -mt-[18.75rem] gap-4">
            <div className="flex flex-col gap-4">
              <Description />
            </div>
            <div className="flex flex-col gap-4">
              <Contact />
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden px-4 space-y-4">
          <WhoAmI />
          <HeroImage />
          <Description />
          <Contact />
          <Projects />
          <SocialMedia />
        </div>
      </div>
    </>
  );
}

export default HeroPage;