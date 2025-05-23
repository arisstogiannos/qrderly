import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

const VideoContainer = ({
	selectedProduct,
	setSelectedProductIndex,
}: {
	selectedProduct: number;
	setSelectedProductIndex: (v: number) => void;
}) => {
	const videos = [
		{ src: "/videos/qr-anim-2-1080.webm", idN: "qrMenu" },
		{ src: "/videos/order-2-1080.webm", idN: "smartMenu" },
		{ src: "/videos/self-service-2-1080.webm", idN: "selfServiceMenu" },
	];
	useEffect(() => {
		if (
			selectedProduct >= 0 &&
			selectedProduct < videos.length &&
			selectedProduct !== null
		) {
			const video = document.getElementById(
				videos[selectedProduct].idN,
			) as HTMLVideoElement;
			if (video) {
				video.play();
				video.currentTime = 0;
			} else {
				console.error(
					`Video element with id '${videos[selectedProduct].idN}' not found.`,
				);
			}
		}
	}, [selectedProduct]);
	const handleVideoEnd = () => {
		setTimeout(() => {
			setSelectedProductIndex((selectedProduct + 1) % 3);
		}, selectedProduct===0?1000:200);
	};
	return (
		<AnimatePresence mode="popLayout">
			{videos.map(
				(video, index) =>
					selectedProduct === index && (
						<motion.video
							onEnded={handleVideoEnd}
							key={video.src}
							animate={{ scale: 1, opacity: 1 }}
							initial={{ scale: 0.9, opacity: 0 }}
							exit={{ opacity: 0, scale: 1.05 }}
							transition={{ duration: 0.5 }}
							id={video.idN}
							preload="auto"
							autoPlay
							playsInline
							muted
							src={video.src}
							className={
								"bg-clip-content  video h-full w-full object-cover  rounded-3xl "
							}
						/>
					),
			)}
		</AnimatePresence>
	);
};

export default VideoContainer;
