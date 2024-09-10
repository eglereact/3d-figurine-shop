import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    {
      src: "images/slide.jpg",
      text: "Slide 1 Text",
    },
    {
      src: "images/slide2.jpg",
      text: "Slide 2 Text",
    },
    {
      src: "images/slide3.jpg",
      text: "Slide 3 Text",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 2000, // Slows down the fade transition
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    beforeChange: (current, next) => setCurrentSlide(next),
  };

  return (
    <div className="w-full  mx-auto overflow-hidden">
      {" "}
      {/* Fix for spacing */}
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="relative w-full h-[700px]">
            <img
              src={image.src}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-center">
              <h2 className="text-5xl text-white mb-4" data-aos="fade-up">
                {image.text}
              </h2>{" "}
              {/* Visible and centered */}
              <button
                className="px-4 py-2 bg-white text-gray-800 rounded-md cursor-pointer"
                onClick={() => alert(`Button on ${image.text}`)}
              >
                Button
              </button>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
