"use client";
import type React from "react";
import { PenLine, Sparkles } from "lucide-react";
import { Modal } from "@/app/[locale]/(business)/[businessName]/dashboard/_components/SharedComponents/Modal";
import { cn } from "@/lib/utils";
import { Link, useRouter } from "@/i18n/navigation";
import { useModalContext } from "@/context/ModalProvider";
import { useTranslations } from "next-intl";
import { RoutingConfig } from "next-intl/routing";

export function MainButton({
  children,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const t = useTranslations("MainButton");


  return (
    <Modal
      title={t("title")}
      subtitle={t("subtitle")}
      trigger={<Button {...props}>{children}</Button>}
      classNames="py-5 xl:max-w-2xl 2xl:max-w-2xl"
      animate={false}
    >
      <div className="grid  grid-cols-1 md:grid-cols-2 gap-6 p-4">
        <MethodCard
          href={{ pathname: "/get-started", hash: "" }}
          icon={<PenLine className="w-8 h-8 text-primary" />}
          title={t("createYourself.title")}
          description={t("createYourself.description")}
          gradient="from-background/80 to-background"
          hoverGradient="from-primary/5 via-background/90 to-background"
          recommended={true}
        />

        <MethodCard
          href={{ pathname: "/", hash: "#order-menu-form" }}
          icon={<Sparkles className="w-8 h-8 text-primary" />}
          title={t("letUsCreate.title")}
          description={t("letUsCreate.description")}
          gradient="from-background/80 to-background"
          hoverGradient="from-primary/5 via-background/90 to-background"
        />
      </div>
    </Modal>
  );
}
export function Button({
  className,
  children,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  return (
    <button
      {...props}
      className={cn(
        " inline-block p-px font-medium leading-6 text-background hover:text-primary bg-foreground shadow-lg cursor-pointer rounded-2xl  shadow-primary/70 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-primary relative group",
        className
      )}
    >
      <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-cyan-500 to-sky-600 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <span className="relative z-10 block px-6 py-3 rounded-2xl bg-inherit w-full">
        <div className="relative z-10 flex items-center justify-center space-x-3 w-full">
          <span className="transition-all duration-500 group-hover:translate-x-1.5 justify-center  flex gap-4 w-full items-center">
            {children}
          </span>
        </div>
      </span>
    </button>
  );
}
interface MethodCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  hoverGradient: string;
  href: { pathname: "/get-started" | "/"; hash: string };
  recommended?: boolean;
}

function MethodCard({
  icon,
  title,
  description,
  gradient,
  hoverGradient,
  href,
  recommended = false,
}: MethodCardProps) {
  const { setOpen } = useModalContext();
  const t = useTranslations("MainButton");
  const router = useRouter();

  return (
    <>
      {href.hash !== "" ? (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
              setOpen(false);  
              setTimeout(() => {
                //@ts-expect-error
                router.push(`/${href.hash}`);
              }, 100)
            
           
          }}
          className="group cursor-pointer relative flex flex-col items-center p-6 rounded-2xl border border-primary/20 overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 w-full"
          aria-label={title}
        >
          {/* Background gradients */}
          {recommended && (
            <span className="absolute z-10  top-0 left-0 bg-primary text-background px-2 py-1 rounded-br-lg text-sm">
              {t("recommended")}
            </span>
          )}

          <div
            className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-opacity duration-500`}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-br ${hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          />

          {/* Subtle animated glow effect */}
          <div className="absolute -inset-1 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 opacity-0 group-hover:opacity-70 transition-all duration-700 group-hover:duration-500 animate-pulse" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 shadow-sm">
              {icon}
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary/90 transition-colors duration-300 text-center text-pretty">
              {title}
            </h3>
            <p className="text-muted-foreground text-center max-w-3xl leading-relaxed text-pretty">
              {description}
            </p>
          </div>
        </button>
      ) : (
        <Link
          href={{ pathname: href.pathname, hash: href.hash }}
          className="group cursor-pointer relative flex flex-col items-center p-6 rounded-2xl border border-primary/20 overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
          aria-label={title}
        >
          {/* Background gradients */}
          {recommended && (
            <span className="absolute z-10  top-0 left-0 bg-primary text-background px-2 py-1 rounded-br-lg text-sm">
              {t("recommended")}
            </span>
          )}

          <div
            className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-opacity duration-500`}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-br ${hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          />

          {/* Subtle animated glow effect */}
          <div className="absolute -inset-1 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 opacity-0 group-hover:opacity-70 transition-all duration-700 group-hover:duration-500 animate-pulse" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 shadow-sm">
              {icon}
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary/90 transition-colors duration-300 text-center text-pretty">
              {title}
            </h3>
            <p className="text-muted-foreground text-center max-w-3xl leading-relaxed text-pretty">
              {description}
            </p>
          </div>
        </Link>
      )}
    </>
  );
}

export function MainButtonLink({href, children, className, ...props}: React.ComponentProps<"a">) {
  return (
    <Link
    //@ts-expect-error
    href={href}
    {...props}
    className={cn(
      " inline-block p-px font-medium leading-6 text-background hover:text-primary bg-foreground shadow-lg cursor-pointer rounded-2xl  shadow-primary/70 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-primary relative group",
      className
    )}
  >
    <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-cyan-500 to-sky-600 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    <span className="relative z-10 block px-6 py-3 rounded-2xl bg-inherit">
      <div className="relative z-10 flex items-center justify-center space-x-3">
        <span className="transition-all duration-500 group-hover:translate-x-1.5 justify-center  flex gap-4 w-full items-center">
          {children}
        </span>
      </div>
    </span>
  </Link>
  );
} 
