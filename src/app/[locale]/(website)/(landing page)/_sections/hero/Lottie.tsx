"use client";

import { type LottieOptions, useLottie } from "lottie-react";
import landingLottie from "./landing-lottie.json";
const LandingLottie = () => {
  const defaultOptions:LottieOptions = {
    animationData: landingLottie,
    loop: true,
    autoplay: true,

  };


  const { View } = useLottie(defaultOptions);

  return (
    <>
      <div className="">
        <div className="w-full">{View}</div>
      </div>
    </>
  );
};

export default LandingLottie;