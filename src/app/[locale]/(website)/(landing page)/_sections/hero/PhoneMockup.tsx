import Image from "next/image";

export default function PhoneMockup() {
	return (
		<div className=" w-[370px] place-content-center mx-auto relative md:w-[650px] lg:w-[850px] xl:w-[640px] h-auto aspect-[4/5] md:aspect-square ">
			<Image
				src="/qr menu with ordering system example.webp"
				alt="Interactive QR code menu system with digital ordering capabilities"
				fill
				priority={false}
				quality={100}
				loading="eager"
				placeholder="empty"
				sizes="(min-width: 768px) 640px, 384px"
				className="object-contain animate-float-slow  rounded-3xl overflow-hidden"
			/>
		</div>
	);
}
