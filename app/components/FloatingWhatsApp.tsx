"use client";

type FloatingWhatsAppProps = {
  onOpenLeadModal: () => void;
};

export default function FloatingWhatsApp({
  onOpenLeadModal,
}: FloatingWhatsAppProps) {
  return (
    <button
      type="button"
      aria-label="Falar com consultor pelo WhatsApp"
      onClick={onOpenLeadModal}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-lg transition hover:bg-[#1ebe5b] focus:outline-none focus:ring-2 focus:ring-[#25D366]/60 focus:ring-offset-2 focus:ring-offset-transparent"
    >
      {/* Ícone clássico do WhatsApp, vetorizado */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        aria-hidden="true"
        className="h-7 w-7"
      >
        <path
          d="M16 3C9.374 3 4 8.373 4 15c0 2.362.708 4.558 1.926 6.395L4 29l7.828-1.89A11.88 11.88 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3Z"
          fill="currentColor"
        />
        <path
          d="M13.07 10.36c-.26-.582-.535-.595-.784-.605-.203-.009-.435-.009-.667-.009s-.613.088-.935.435c-.322.347-1.23 1.201-1.23 2.93 0 1.729 1.26 3.4 1.435 3.637.177.237 2.425 3.878 5.983 5.28 2.961 1.168 3.563.935 4.203.876.64-.06 2.07-.847 2.363-1.665.293-.818.293-1.518.205-1.665-.088-.146-.322-.234-.673-.41-.351-.176-2.07-1.02-2.39-1.137-.32-.118-.553-.177-.785.177-.233.353-.902 1.137-1.106 1.37-.204.234-.409.264-.76.088-.351-.176-1.484-.546-2.829-1.74-1.046-.933-1.751-2.086-1.956-2.44-.204-.353-.022-.544.154-.72.158-.157.351-.41.526-.615.176-.205.234-.353.351-.586.117-.234.058-.44-.03-.616-.088-.175-.77-1.914-1.083-2.607Z"
          fill="#fff"
        />
      </svg>
    </button>
  );
}
