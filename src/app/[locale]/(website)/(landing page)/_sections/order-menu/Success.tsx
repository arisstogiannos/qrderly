import React from "react";
import { ArrowRight,  Check,  CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function Success() {
  const t = useTranslations("Success");
  const hasAccount = !!useSession().data?.user;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto p-6"
    >
      <div className="grid md:grid-cols-2 gap-8 gap-x-40 items-start">
        {/* Left Column - Thank You & Order Info */}
        <motion.div variants={itemVariants} className="space-y-8">
          {/* Success Header */}
          <div className="space-y-4">
            <motion.div 
              className="flex"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
            >
              <CheckCircle className="w-16 h-16 text-green-500" />
            </motion.div>
            <motion.h2 
              variants={itemVariants}
              className="text-3xl font-bold"
            >
              {t("title")}
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-lg"
            >
              {t("subtitle")}
            </motion.p>
          </div>

          {/* Order Information */}
          <motion.div 
            variants={itemVariants}
            className="bg-primary/70 max-w-md p-6 rounded-lg space-y-2"
          >
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Info className="w-6 h-6" /> {t("details.title")}
            </h3>
            <p className="">
              {t("details.description")}
            </p>
          </motion.div>

          {/* Support Section */}
          <motion.div variants={itemVariants} className="">
            <p>
              {t("support.text")}{" "}
              <a
                href="mailto:info@scanby.cloud"
                className="underline underline-offset-3 hover:text-background transition-colors"
              >
                info@scanby.cloud
              </a>
            </p>
          </motion.div>
        </motion.div>

        {/* Right Column - Next Steps */}
        <motion.div 
          variants={itemVariants}
          className="bg-secondary  sm:p-8 rounded-lg"
        >
          <motion.h3 
            variants={itemVariants}
            className="text-2xl font-semibold mb-6"
          >
            {t("nextSteps.title")}
          </motion.h3>
          <div className="space-y-8">
            <motion.div 
              variants={itemVariants}
              className="flex items-start space-x-4"
            >
              <span className="bg-foreground/15 text-background size-9 lg:size-10 rounded-full p-1 min-w-9 lg:min-w-10 flex-center">
                <span className="bg-foreground text-background size-6 lg:size-7 rounded-full p-1 min-w-6 lg:min-w-7 flex-center">
                  {hasAccount ? <Check/> : 1}
                </span>
              </span>
              <div>
                <h4 className="font-medium text-lg">
                  {t("nextSteps.step1.title")}
                </h4>
                <p className="">
                  {t("nextSteps.step1.description")}
                </p>
                {!hasAccount && (
                  <Button
                    variant="default"
                    className="mt-4 bg-foreground text-background "
                    asChild
                >
                  <Link href="/sign-up" className="">
                    {t("nextSteps.step1.button")} <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                )}
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="flex items-start space-x-4"
            >
              <span className="bg-foreground/15 text-background size-9 lg:size-10 rounded-full p-1 min-w-9 lg:min-w-10 flex-center shrink-0">
                <span className="bg-foreground text-background size-6 lg:size-7 rounded-full p-1 min-w-6 lg:min-w-7 flex-center">
                  2
                </span>
              </span>
              <div>
                <h4 className="font-medium text-lg">
                  {t("nextSteps.step2.title")}
                </h4>
                <p className="">
                  {t("nextSteps.step2.description")}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
