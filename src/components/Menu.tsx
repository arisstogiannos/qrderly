"use client";
import React from "react";
import { motion } from "framer-motion";
import {getPathname, Link} from "@/i18n/navigation";

import { Button } from "./ui/button";
import { Session } from "next-auth";
import { useTranslations } from "next-intl";

const Menu = ({
  isOpen,
  setIsOpen,
  session,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  session: Session | null;
}) => {
  const t = useTranslations("navbar")
  type Href = Parameters<typeof getPathname>[0]["href"];

  const navlinks:{title:string,href:Href,subLinks?:{title:string,href:Href}[]}[] = [
    { title: t("Home"), href: "/" },
    {
      title: t("Products"),
      href: "/",
      subLinks: [
        { title: t("QR Menu.title"), href: "/products/qr-menu" },
        { title: t("Smart qr menu"), href: "/products/smart-ordering-qr-menu" },
        { title: t("self service menu"), href: "/products/self-service-smart-menu" },
      ],
    },
    { title: t("Pricing"), href: "/pricing" },
    { title: t("FAQ/Contact"), href: "/FAQ-contact" },
  ];
  const sociallinks = [
    { title: "instagram", href: "https://www.instagram.com/helenas_rooms/" },
    { title: "facebook", href: "https://www.facebook.com/Helenasrooms/" },
  ];

  function handleClick() {
    document.body.classList.remove("overflow-hidden");
    setIsOpen(false);
  }

  return (
    <motion.div
      animate={
        isOpen
          ? { opacity: 1, transition: { duration: 0.3, ease: "circOut" } }
          : {
              opacity: 0,
              transition: { duration: 0.3, ease: "circOut", delay: 0.3 },
            }
      }
      initial={{ opacity: 0 }}
      className={`w-screen ${
        !isOpen ? "pointer-events-none" : "pointer-events-auto"
      } px-6  h-[100svh]  flex flex-col xl:flex-row  bg-foreground text-background fixed top-0 left-0 z-20  `}
    >
      <ul className="text-6xl md:text-8xl  flex flex-col gap-5 mt-auto  capitalize">
        {navlinks.map((link, i) =>
          link.subLinks ? (
            <div key={i} className="flex flex-col gap-y-2">
              <motion.span
              initial={{opacity:0}}
                animate={
                  isOpen
                    ? {
                        opacity:1,
                        transition: {
                          delay: 0.2 + i * 0.05,
                          duration: 0.8,
                          ease: "circOut",
                        },
                        
                      }
                    : {
                       opacity:0,
                       transition: {
                        delay: i * 0.05,
                        duration: 0.3,
                        ease: "circIn",
                      },
                      }
                }
                className="text-muted-foreground text-base "
              >
                products
              </motion.span>
              {link.subLinks.map((sub) => (
                <motion.span
                  key={sub.title}
                  className="group overflow-hidden pl-4"
                >
                  <motion.li
                    className="origin-left text-4xl"
                    onClick={handleClick}
                    animate={
                      isOpen
                        ? {
                            rotateZ: 0,
                            y: 0,
                            transition: {
                              delay: 0.2 + i * 0.05,
                              duration: 0.8,
                              ease: "circOut",
                            },
                          }
                        : {
                            rotateZ: "30deg",
                            y: 180,
                            transition: {
                              delay: i * 0.05,
                              duration: 0.3,
                              ease: "circIn",
                            },
                          }
                    }
                  >
                    <Link className="relative " href={sub.href}>
                      {/* <motion.span  className="absolute top-1/2 left-0 translate-y-full -z-40 bg-mBrown  w-full scale-x-0 h-2 group-hover:scale-x-100 origin-left transition-transform duration-700"></motion.span> */}
                      {sub.title}
                    </Link>
                  </motion.li>
                </motion.span>
              ))}
            </div>
          ) : (
            <motion.span key={i} className="group overflow-hidden ">
              <motion.li
                className="origin-left "
                onClick={handleClick}
                animate={
                  isOpen
                    ? {
                        rotateZ: 0,
                        y: 0,
                        transition: {
                          delay: 0.2 + i * 0.05,
                          duration: 0.8,
                          ease: "circOut",
                        },
                      }
                    : {
                        rotateZ: "30deg",
                        y: 180,
                        transition: {
                          delay: i * 0.05,
                          duration: 0.3,
                          ease: "circIn",
                        },
                      }
                }
              >
                <Link className="relative " href={link.href}>
                  {/* <motion.span  className="absolute top-1/2 left-0 translate-y-full -z-40 bg-mBrown  w-full scale-x-0 h-2 group-hover:scale-x-100 origin-left transition-transform duration-700"></motion.span> */}
                  {link.title}
                </Link>
              </motion.li>
            </motion.span>
          )
        )}
      </ul>
      <div className="pb-10 pt-20 flex items-center justify-between">
        <a href="mailto:info@scanby.cloud" className="text-base md:text-lg">
          info@scanby.cloud
        </a>
        <Button
          onClick={handleClick}
          size={"lg"}
          className="text-xl md:text-3xl md:p-8 p-4 px-3 "
          asChild
        >
          {!session ? (
            <Link href={"/sign-up"} className="">
              {t("signBtn")}
            </Link>
          ) : (
            <Link href={"/get-started"} className="">
              {t("createBtn")}
            </Link>
          )}
        </Button>
      </div>
      {/* <ul className="text-xl lg:text-4xl xl:text-3xl  3xl:text-2xl text-background/60  max-xl:flex-wrap flex font-medium  gap-x-8 gap-y-4 mt-24 xl:mt-auto 2xl:ml-auto pb-5 lg:pb-10  capitalize">
          {sociallinks.map((link, i) => {
            return (
              <motion.span key={i} className="overflow-hidden ">
                <motion.li
                  className="origin-left hover:text-black transition-colors duration-500"
                  animate={
                    isOpen
                      ? {
                          rotateZ: 0,
                          y: 0,
                          transition: {
                            delay: 0.2 + i * 0.05,
                            duration: 0.8,
                            ease: "circOut",
                          },
                        }
                      : {
                          rotateZ: "30deg",
                          y: 180,
                          transition: {
                            delay: i * 0.05,
                            duration: 0.3,
                            ease: "circIn",
                          },
                        }
                  }
                >
                  <motion.a href={link.href}>{link.title}</motion.a>
                </motion.li>
              </motion.span>
            );
          })}
        </ul> */}
    </motion.div>
  );
};

export default Menu;
