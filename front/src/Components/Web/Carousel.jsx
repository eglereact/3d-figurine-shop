import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as l from "../../Constants/urls";

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    {
      src: "images/slide.jpg",
      text: "Explore Our Latest Products – Find Your Perfect Match!",
      linkText: "shop now",
      link: l.SITE_PRODUCTS,
    },
    {
      src: "images/slide2.jpg",
      text: "Don't Miss Out on Exclusive Sales – Shop Now and Save!",
      linkText: "shop now",
      link: l.SALE_PAGE,
    },
    {
      src: "images/slide3.jpg",
      text: "Stay Inspired – Visit Our Blog for Tips, Trends, and More!",
      linkText: "visit",
      link: l.SITE_HOME,
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 3000, // Slow transition speed
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000, // Time on each slide
    fade: true,
    beforeChange: (current, next) => setCurrentSlide(next),
  };

  return (
    <div className="w-full overflow-hidden">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="relative w-full h-[700px]">
            <img
              src={image.src}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Adjusted container to avoid overlap with dots */}
            <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 z-20 pb-10 text-center">
              {/* Text Animation */}
              <h2
                key={currentSlide}
                className="text-5xl text-white mb-8 bg-black bg-opacity-50 p-4 rounded-md slide-fade-in-text"
              >
                {image.text}
              </h2>
              {/* Button Animation */}
              <a
                key={currentSlide + "-link"}
                href={image.link}
                className="text-white uppercase px-4 text-xl border-2 border-white bg-black bg-opacity-50 p-3 rounded-md inline-block slide-fade-in-link"
              >
                {image.linkText}
              </a>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
