import React from "react";
import HeroCarousel from "./HeroCarousel";
import Tour from "../Tours";
import Contact from "../Contact";

function Home() {
  return (
    <div className="home-page">
      <HeroCarousel />

      <Tour />

      <Contact />
    </div>
  );
}

export default Home;
