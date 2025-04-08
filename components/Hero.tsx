"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ChevronRight, MoveRight } from "lucide-react";
import Iphone15Pro from "./magicui/iphone-15-pro";
import { Safari } from "./magicui/safari";
import { InteractiveHoverButton } from "./magicui/interactive-hover-button";

const Hero = ({id}:{id:string}) => {
  // const [showCTA, setShowCTA] = useState(false);

  // useEffect(() => {
  //   const timer = setTimeout(() => setShowCTA(true), 2000);
  //   return () => clearTimeout(timer);
  // }, []);

  const handleClick = () => {
    const message = encodeURIComponent("Hi Ship, I am interested, let us connect.");
    const phoneNumber = "+919748412275";
    const isMobile = /iPhone|iPad|Android|Mobile/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = `https://wa.me/${phoneNumber}?text=${message}`;
    } else {
      window.open(`https://web.whatsapp.com/send?phone=${phoneNumber}&text=${message}`, "_blank");
    }
  };

  return (
    <section  className="w-full flex md:flex-row flex-col mt-10 md:px-10 py-4 gap-6" id={id}>
      {/* Left Content Block */}
      <div className="md:flex-1 px-6 md:px-0 mt-10">
        {/* Headline */}
        <h1
          
          className="md:text-7xl text-5xl font-clash font-semibold md:w-4/5 leading-tight"
        >
          Manage Orders, Shipments & Inventory in One Click
        </h1>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="text-lg mt-6 md:w-4/5 font-medium dark:text-dark-text-secondary text-dark-dark-gray"
        >
          "No more order delays or inventory mishaps. Get a smart dashboard that keeps everything in check, so you can focus on growing your business."
        </motion.h2>
        {/* Delayed CTA Button */}
       
  <div className="gradient-border mt-4 mx-auto ">
    <InteractiveHoverButton className="gradient-border-inner  text-base md:text-lg " onClick={handleClick}>
      Get a Demo
    </InteractiveHoverButton>
  </div>


        {/* Subheading */}
        
      </div>

      {/* Right Side Mockups */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        data-theme="dark"
        className="md:flex-1 rounded-3xl relative md:mt-0 mt-6 py-4 dark"
      >
        <Safari url="shiptrack.com" className="size-full" imageSrc="/webMock.jpg"  />
        {/* <Iphone15Pro className="size-[70%] absolute bottom-0" src="/whatsappMock.jpg" stroke="2px" /> */}
      </motion.div>
    </section>
  );
};

export default Hero;
