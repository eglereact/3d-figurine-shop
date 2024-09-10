import React, { useState, useEffect } from "react";

const TimerCountDown = () => {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2024-12-01T00:00:00"); // Your target date here

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTime({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-grey text-white">
      <div className="max-width flex flex-col-reverse gap-8 md:gap-0 md:flex-row justify-between items-center">
        <div>
          <img src="images/timer.png" className="w-[420px]" />
        </div>
        <div className="flex flex-col items-center md:items-start">
          <h2 className="uppercase text-3xl">Don’t sleep on this sale</h2>
          <p className="text-sm">Our semi-annual sale ends soon!</p>
          <a
            href="#sale"
            className="w-40 uppercase py-2 mt-4 text-white text-center bg-transparent border-[0.5px] border-white mb-2 rounded button-empty-animation "
          >
            shop now
          </a>
        </div>
        <div>
          {time.days === 0 &&
          time.hours === 0 &&
          time.minutes === 0 &&
          time.seconds === 0 ? (
            ""
          ) : (
            <div className="flex text-center uppercase  items-center pt-10 md:pt-0">
              <div className="single-box">
                <div data-aos="fade-right" data-aos-once={true}>
                  <h1 className="text-5xl">{time.days}</h1>
                  <p className="text-xs">Days</p>
                </div>
              </div>

              <div className="single-box">
                <div
                  data-aos="fade-right"
                  data-aos-delay={300}
                  data-aos-once={true}
                >
                  <h1 className="text-5xl">{time.hours}</h1>
                  <p className="text-xs">Hours</p>
                </div>
              </div>

              <div className="single-box">
                <div
                  data-aos="fade-right"
                  data-aos-delay={600}
                  data-aos-once={true}
                >
                  <h1 className="text-5xl">{time.minutes}</h1>
                  <p className="text-xs">Minutes</p>
                </div>
              </div>

              <div className="single-box border-none">
                <div
                  data-aos="fade-right"
                  data-aos-delay={900}
                  data-aos-once={true}
                >
                  <h1 className="text-5xl">{time.seconds}</h1>
                  <p className="text-xs">Seconds</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TimerCountDown;
