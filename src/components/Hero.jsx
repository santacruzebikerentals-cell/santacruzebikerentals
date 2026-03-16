export function Hero() {
  return (
    <section className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 overflow-hidden h-[700px]">
      {/* Full-bleed background image */}
      <img
        src="/images/westcliff2.jpeg"
        alt="Santa Cruz E-Bike Coastline"
        className="absolute inset-0 w-full h-full object-cover filter grayscale saturate-90 opacity-80"
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10"></div>

      {/* Content container */}
      <div className="relative z-10 px-8 py-24 text-white max-w-3xl mx-auto text-left">
        <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
          Coastal Riding,  
          <span className="block text-slate-100 mt-1">Fully Reimagined.</span>
        </h1>
        <p className="mt-6 text-lg text-white/90">
          Premium e-bikes delivered anywhere in Santa Cruz. Explore iconic cliffs, quiet wildlife routes, and hidden beaches — all without the hassle.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="#/book"
            className="bg-green-400 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-green-500 transition font-medium"
          >
            Book Your Ride
          </a>
          <a
            href="#tours"
            className="px-6 py-3 rounded-xl border border-white/70 hover:bg-white/20 transition font-medium text-white"
          >
            See Tours
          </a>
        </div>
      </div>
    </section>
  );
}
