import { ArrowRight } from "lucide-react";
import Image from "next/image";
import React from "react";
import { MainButton, MainButtonLink } from "./MainButton";
import { getTranslations } from "next-intl/server";
import MenuCarousel from "./MenuCarousel";
import PhoneMockup from "./PhoneMockup";

export default async function Hero() {
	const t = await getTranslations("Hero");
	return (
		<div className="grid grid-cols-1 xl:grid-cols-2 xl:gap-10 grid-rows-[auto_auto] gap-y-8 xl:grid-rows-1 xl:mt-20 xl:h-[700px] mb-0 lg:mb-40">
			<div className="absolute top-0  left-0 -z-10  xl:w-full h-screen overflow-x-hidden w-screen backgroundMesh  ">
				{/* <div className="absolute top-0 xl:-top-48 left-0 -z-10 w-[1000px] lg:w-[1200px] xl:w-full h-auto aspect-video">
          <Image
            src={"/gradient-bg.png"}
            fill
            alt="gradient bg"
          />
        </div> */}
			</div>
			<div className="space-y-5 mt-10 sm:mt-0 3xl:mt-24">
				<h1 className=" font-bold  text-5xl text-center lg:text-left md:text-6xl leading-tight ">
					{t("title")}
				</h1>
				<h2 className="text-xl md:text-4xl text-center lg:text-left">
					{t("subtitle")}
				</h2>
				<div className="w-full flex justify-center gap-4 md:justify-start items-center ">
					<MainButton className=" 3xl:mt-14 md:text-xl  text-center ">
						{t("button")} <ArrowRight />
					</MainButton>
					<MainButtonLink
						href="/Bruncherie/smart-menu"
						target="_blank"
						rel="noopener noreferrer"
						className="text-center 3xl:mt-14 md:text-xl bg-primary border border-foreground/20 lg:hover:text-background  font-medium"
					>
						{t("demoButton")}
					</MainButtonLink>
				</div>
			</div>

			<PhoneMockup />
			{/* <LandingLottie /> */}
			{/* <MenuCarousel /> */}
		</div>
	);
}
