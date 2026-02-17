import Image from "next/image";

interface AkazaLogoProps {
  className?: string;
  variant?: "primary" | "secondary";
}

export default function AkazaLogo({
  className = "",
  variant = "secondary",
}: AkazaLogoProps) {
  const darkSrc =
    variant === "primary"
      ? "/images/logos/primary-dark.png"
      : "/images/logos/secondary-dark.png";
  const lightSrc =
    variant === "primary"
      ? "/images/logos/primary-light.png"
      : "/images/logos/secondary-light.png";

  return (
    <>
      <Image
        src={darkSrc}
        alt="AKAZA Travel"
        width={220}
        height={72}
        className={`h-auto w-[170px] theme-dark-only ${className}`.trim()}
        priority
      />
      <Image
        src={lightSrc}
        alt="AKAZA Travel"
        width={220}
        height={72}
        className={`h-auto w-[170px] theme-light-only ${className}`.trim()}
        priority
      />
    </>
  );
}
