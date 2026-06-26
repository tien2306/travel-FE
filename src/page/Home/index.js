import React from "react";
import HeroCarousel from "./HeroCarousel";
import TourSection from "./TourSection";
import "./home.scss";

function Home() {
  return (
    <div className="home-page">
      <HeroCarousel />

      <TourSection />
    </div>
  );
}

export default Home;
