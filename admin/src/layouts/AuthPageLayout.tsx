import React, { useEffect, useState } from "react";
import loginImage1 from "../assets/login/Section-2.svg";
import loginImage2 from "../assets/login/Section.svg";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const images = [loginImage1, loginImage2];
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % images.length);
        setFade(false);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        <div className="flex flex-col flex-1 bg-[#0C111D] dark:bg-[#0C111D]">
          {children}
        </div>
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid relative overflow-hidden">
          <img
            src={images[current]}
            alt="Login visual"
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ${
              fade ? "opacity-0" : "opacity-100"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
