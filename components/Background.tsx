export function Background() {
  const grid =
    "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)";
  const mask = "radial-gradient(ellipse at center, black 30%, transparent 75%)";

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute -left-32 -top-32 h-[28rem] w-[28rem] animate-float rounded-full bg-accent-violet/20 blur-3xl" />
      <div className="absolute -right-24 top-1/3 h-[26rem] w-[26rem] animate-float rounded-full bg-accent-cyan/10 blur-3xl [animation-delay:-6s]" />
      <div className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] animate-float rounded-full bg-accent-pink/10 blur-3xl [animation-delay:-12s]" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: grid,
          backgroundSize: "56px 56px",
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />
    </div>
  );
}