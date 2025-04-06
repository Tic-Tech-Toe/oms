import Features from "@/components/Features";
import Footer from "@/components/Footer";
import GenJaadu from "@/components/GenJaadu";
import Header from "@/components/Header";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="relative w-screen min-h-screen overflow-x-hidden">
      <div className="aurora absolute z-0" />
      
      {/* Content goes above */}
      <Header /> {/* Likely z-50 */}
      <Hero id="hero" />
      <Features id="features" />
      <GenJaadu id="genjaadu" />
      <Footer id="footer" />
    </div>
  );
}
