import Features from "@/components/Features";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Image from "next/image";
// import { useEffect } from "react";

export default function Home() {

  // useEffect(() => {
  //   const aurora = document.querySelector(".aurora")
  //   const colors = [
  //     ["#ff0000", "#ff7300", "#ffeb00"],
  //     ["#ffeb00", "#00ff6a", "#007bff"],
  //     ["#007bff", "#7300ff", "#ff0000"],
  //   ]

  //   let i = 0;
  //   const changeGrad = () => {
  //     i = (i+1)%colors.length;
  //     aurora.style.background = `linear-gradient(45deg, ${colors[i][0]}, ${colors[i][1]}, ${colors[i][2]})`;
  //   };

  //   const interval = setInterval(changeGrad,5000);
  //   return () => clearInterval(interval);

  // },[])

  return (
    <div className="">
      <Header />
      <Hero />
      {/* <Features /> */}
      <div className="aurora dark:opacity-80"></div>
    </div>
  );
}
