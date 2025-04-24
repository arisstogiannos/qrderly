import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

const VideoContainer = ({ selectedProduct }: { selectedProduct: number }) => {
  const videos = [
    { src: "/videos/QR animation.webm", idN: "qrMenu" },
    { src: "/videos/order.webm", idN: "smartMenu" },
    { src: "/videos/self-service.webm", idN: "selfServiceMenu" },
  ];
  useEffect(() => {
    if (
      selectedProduct >= 0 &&
      selectedProduct < videos.length &&
      selectedProduct !== null
    ) {
      const video = document.getElementById(
        videos[selectedProduct].idN
      ) as HTMLVideoElement;
      if (video) {
        video.play();
        video.currentTime = 0;
      } else {
        console.error(
          `Video element with id '${videos[selectedProduct].idN}' not found.`
        );
      }
    }
  }, [selectedProduct]);

  return (
    <AnimatePresence mode="popLayout">
      {videos.map(
        (video, index) =>
          selectedProduct === index && (
            <motion.video
              key={video.src}
              animate={{ scale: 1, opacity: 1 }}
              initial={{ scale: 0.9, opacity: 0 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              id={video.idN}
              preload="auto"
              // loop
              autoPlay
              playsInline
              muted
              src={video.src}
              className={`bg-clip-content  video h-full w-full object-cover  rounded-3xl `}
            />
          )
      )}
    </AnimatePresence>
  );
};

export default VideoContainer;
