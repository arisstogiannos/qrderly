import { useEffect } from "react";

const VideoContainer = ({ selectedProduct }: { selectedProduct: number }) => {
  const videos = [
    { src: "/QR animation.webm", idN: "des" },
    { src: "/smart QR animation.webm", idN: "seo" },
    { src: "/QR animation.webm", idN: "dev" },
  ];
  useEffect(()=>{
    if (selectedProduct >= 0 && selectedProduct < videos.length && selectedProduct !== null) {
      const video = document.getElementById(videos[selectedProduct].idN) as HTMLVideoElement
      if (video) {
        video.play();
        video.currentTime = 0;
      } else {
        console.error(`Video element with id '${videos[selectedProduct].idN}' not found.`);
      }
    }
  },[selectedProduct])

  return videos.map((video, index) => (
    <div
      style={{
        clipPath:
          selectedProduct === index
            ? "inset(0 0 0 0 ) "
            : "inset(0 50% 0 50% ) ",
      }}
      key={index}
      className="h-full w-full absolute top-0 left-0  transition-all duration-[0.35s] ease-services "
    >
    
        <video
          id={video.idN}
          preload="auto"
          loop
          autoPlay
          playsInline
          muted
          src={video.src}
         
          className={`bg-clip-content  video h-full w-full object-cover`}
        />
      </div>
  ));

};

export default VideoContainer;
