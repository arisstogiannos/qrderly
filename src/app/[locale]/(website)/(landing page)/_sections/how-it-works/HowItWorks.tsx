import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

import React from "react";
import { MainButton } from "../hero/MainButton";
import { getTranslations } from "next-intl/server";

const steps = [
	"create a free account",
	"choose a product",
	"setup your bussiness profile",
	"create and personalize your menu",
	"your menu is online! Your customers can scan the qr code we generated for you or visit your link.",
];

export default async function HowItWorks() {
	const t = await getTranslations("howItWorks");
	return (
		<section className="grid xl:grid-cols-2 grid-rows-[auto_auto] grid-cols-1 xl:grid-rows-1 font-medium ">
			<div className="space-y-8 md:space-y-12 lg:space-y-8  xl:border-r border-foreground lg:pr-28 ">
				<h2 className="text-5xl md:text-8xl text-pretty text-center xl:text-left ">
					{t("title")}
				</h2>
				<p className="text-xl md:text-4xl text-pretty text-center xl:text-left ">
					{t("subtitle")}
				</p>
				<div className="md:gap-x-8 flex max-md:justify-between ">
					<MainButton
						className=" md:text-2xl  font-medium w-full  sm:w-fit "
						
					>

							{t("button1")}

					</MainButton>
					{/* <Button
            variant={"outline"}
            asChild
            className="text-sm  md:text-2xl py-5 md:py-7 pl-4 pr-2 gap-3 md:gap-20 justify-between rounded-3xl"
          >
            <Link href={"/"}>
            {t("button2")}
                <ArrowRight className=" size-6 md:size-8" />
            </Link>
          </Button> */}
				</div>
			</div>
			<ul className=" space-y-5 lg:space-y-8 xl:pl-28 pt-14 xl:pt-0 md:pr-20 lg:pr-0">
				{steps.map((_, i) => (
					<li className="font-medium flex gap-5 items-start" key={i}>
						<span className="flex-center size-8 p-5 md:size-10 md:p-6 bg-foreground text-background rounded-full text-lg md:text-2xl">
							{i + 1}
						</span>
						<p className="text-lg md:text-3xl mt-1 xl:text-2xl">
							{" "}
							{t(`bullets.${i + 1}`)}
						</p>
					</li>
				))}
				<li className="xl:pl-16 text-center space-y-4">
					<div className="text-center   text-xl uppercase">
						<hr />
						{t("or")} <hr />
					</div>
					<p className="text-lg font-normal md:text-3xl mt-1 xl:text-2xl text-center xl:text-left text-pretty">
						{t.rich("orderMenu", {
							link: (chunks) => (
								<a
									href="#order-menu-form"
									className="text-primary underline underline-offset-2"
								>
									{chunks}
								</a>
							),
						})}
					</p>
				</li>
			</ul>
		</section>
	);
}
