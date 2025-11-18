import { ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { MainButton, MainButtonLink } from './MainButton';
import PhoneMockup from './PhoneMockup';

export default async function Hero() {
  const t = await getTranslations('Hero');
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 xl:gap-10 grid-rows-[auto_auto] gap-y-8 md:gap-y-16 xl:grid-rows-1 xl:mt-20 xl:h-[700px] mb-0 lg:mb-40">
      <AnimatedBlobs />
      {/* <div className="absolute top-0  left-0 -z-10  xl:w-full h-screen overflow-x-hidden w-screen backgroundMesh   " /> */}
      <div className="space-y-5 mt-10 sm:mt-0 2xl:mt-10 3xl:mt-24">
        <h1 className=" font-bold  text-[40px] text-center lg:text-left md:text-6xl leading-tight  ">
          {t('title')}
        </h1>
        <h2 className="text-xl font-medium md:text-4xl text-center lg:text-left text-pretty">
          {t('subtitle')}
        </h2>
        <div className="w-full flex justify-center mt-8 2xl:mt-14 gap-3 md:gap-5  lg:justify-start items-center ">
          <MainButton className="md:text-xl text-nowrap  text-center ">
            {t('button')} <ArrowRight />
          </MainButton>
          <MainButtonLink
            href="/Bruncherie/smart-menu"
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            className="text-center md:text-xl bg-transparent border transition-all border-foreground hover:text-background hover:bg-foreground font-medium"
          >
            {t('demoButton')}
          </MainButtonLink>
        </div>
      </div>

      <PhoneMockup />
    </div>
  );
}

function AnimatedBlobs() {
  return (
    <div className="w-full top-0 left-1/2 -translate-x-1/2 absolute -z-40 h-[75vh] md:h-[120vh] bg-background flex items-center justify-center overflow-hidden">
      <div className="bg-background/60 z-50 h-full absolute top-0 left-0 w-full backdrop-blur-[50px]" />
      <svg
        width="800"
        height="600"
        viewBox="0 0 800 600"
        className="w-full h-full md:-translate-y-1/4"
      >
        {/* Abstract Shape 1 - Morphing geometric form */}
        <path fill="#ff6b6b" opacity="1">
          <animate
            attributeName="d"
            dur="20s"
            repeatCount="indefinite"
            values="M400,200 C300,100 100,100 200,200 C100,300 300,500 400,400 C500,500 700,300 600,200 C500,100 450,150 400,200 Z;
                     M350,150 C200,50 -50,50 100,150 C-50,250 200,450 350,350 C450,450 650,250 550,150 C450,50 400,100 350,150 Z;
                     M420,220 C350,150 150,150 220,220 C150,350 350,480 420,420 C550,480 680,350 620,220 C550,150 480,180 420,220 Z;
                     M400,200 C300,100 100,100 200,200 C100,300 300,500 400,400 C500,500 700,300 600,200 C500,100 450,150 400,200 Z;"
          />
          <animate
            attributeName="fill"
            dur="20s"
            repeatCount="indefinite"
            values="#280685;#389BAF;#3856AF;#5838AF;#389BAF;#280685;"
          />
          <animateTransform
            attributeName="transform"
            type="rotate"
            dur="25s"
            repeatCount="indefinite"
            values="0 400 300;360 400 300"
          />
          <animateTransform
            attributeName="transform"
            type="translate"
            dur="20s"
            repeatCount="indefinite"
            values="0,0; -50,-50; 0,0; 20, 20; 0,0" /* It is x,y. Negative values move it up and left */
          />
        </path>
        {/* Abstract Shape 1 - Morphing geometric form */}
        <path fill="#ff6b6b" opacity="1" className="translate-x-1/3 translate-y-1/3">
          <animate
            attributeName="d"
            dur="20s"
            repeatCount="indefinite"
            values="M400,200 L500,150 L600,200 L650,300 L600,400 L500,450 L400,400 L300,450 L200,400 L150,300 L200,200 L300,150 Z;
                     M400,180 L520,120 L620,180 L680,280 L640,380 L540,440 L420,420 L300,440 L180,380 L140,280 L180,180 L280,120 Z;
                     M400,220 L480,100 L580,160 L680,220 L720,320 L680,420 L580,480 L480,520 L380,480 L280,420 L240,320 L280,220 Z;
                     M400,150 L550,100 L650,150 L700,250 L750,350 L700,450 L550,500 L400,550 L250,500 L100,450 L50,350 L100,250 Z;
                     M400,200 L500,150 L600,200 L650,300 L600,400 L500,450 L400,400 L300,450 L200,400 L150,300 L200,200 L300,150 Z"
          />
          <animate
            attributeName="fill"
            dur="25s"
            repeatCount="indefinite"
            values="#389BAF;#3856AF;#5838AF;#280685;#583B8F;#389BAF;#3856AF"
          />
          <animateTransform
            attributeName="transform"
            type="rotate"
            dur="25s"
            repeatCount="indefinite"
            values="0 400 300;360 400 300"
          />
        </path>

        {/* Abstract Shape 2 - Angular morphing form */}
        <path fill="#4ecdc4" opacity="1">
          <animate
            attributeName="d"
            dur="20s"
            repeatCount="indefinite"
            values="M200,150 L280,100 L360,150 L400,230 L360,310 L280,360 L200,340 L120,360 L40,310 L0,230 L40,150 L120,100 Z;
                     M200,130 L300,80 L380,130 L420,210 L380,290 L300,340 L220,320 L140,340 L60,290 L20,210 L60,130 L140,80 Z;
                     M200,170 L260,50 L340,90 L420,170 L460,250 L420,330 L340,410 L260,450 L180,410 L100,330 L60,250 L100,170 Z;
                     M200,100 L320,60 L400,120 L460,200 L500,280 L460,360 L400,440 L320,480 L240,440 L160,360 L120,280 L160,200 Z;
                     M200,150 L280,100 L360,150 L400,230 L360,310 L280,360 L200,340 L120,360 L40,310 L0,230 L40,150 L120,100 Z"
          />
          <animate
            attributeName="fill"
            dur="20s"
            repeatCount="indefinite"
            values="#280685;#389BAF;#3856AF;#5838AF;#389BAF;#280685;"
          />
          <animateTransform
            attributeName="transform"
            type="translate"
            dur="20s"
            repeatCount="indefinite"
            values="0,300;80,350;0,400;-50,450;0,300"
          />
        </path>
      </svg>
    </div>
  );
}
