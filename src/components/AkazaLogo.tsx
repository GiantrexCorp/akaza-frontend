interface AkazaLogoProps {
  iconSize?: string;
  textSize?: string;
  showSubtext?: boolean;
}

export default function AkazaLogo({
  iconSize = "w-8 h-8",
  textSize = "text-2xl",
  showSubtext = true,
}: AkazaLogoProps) {
  return (
    <div className="flex flex-col items-center justify-center cursor-pointer">
      <svg
        className={`${iconSize} text-primary mb-1`}
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2L2 22H7L12 12L17 22H22L12 2ZM12 5.8L15.1 12H8.9L12 5.8Z" />
      </svg>
      <div className="text-center leading-none">
        <span className={`text-white ${textSize} font-serif tracking-widest block`}>
          AKAZA
        </span>
        {showSubtext && (
          <span className="text-primary text-[0.6rem] uppercase tracking-[0.4em] font-sans block mt-1">
            Travel
          </span>
        )}
      </div>
    </div>
  );
}
