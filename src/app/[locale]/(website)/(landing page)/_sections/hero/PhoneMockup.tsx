import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

export default function PhoneMockup() {
	return (
			<div className=" w-[370px] place-content-center mx-auto relative md:w-[650px] lg:w-[850px] xl:w-[690px] h-auto aspect-[4/5] md:aspect-square ">
				<Image
					src="/2phones.png"
					alt="qr menu example"
					fill
					priority
					quality={100}
					sizes="(max-width: 768px) 520px, (max-width: 1024px) 650px, (max-width: 1280px) 850px, 1000px"
					className="object-contain animate-float-slow  rounded-3xl overflow-hidden"
				/>
			</div>

	);
}
