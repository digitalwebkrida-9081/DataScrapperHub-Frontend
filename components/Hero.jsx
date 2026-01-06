export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image */}
      <img
        src="/images/hero-bg.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

 

      {/* Content */}
      <div className="relative z-10 text-white">
        <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Premiere Web Scraping Solutions
            </h1>

            <p className="mt-6 text-lg text-slate-200 max-w-xl">
              Experience industry-leading website scraping services relied upon by enterprises globally.
            </p>

            <div className="mt-8 flex gap-4">
              <a
                href="#database"
                className="inline-flex items-center px-5 py-3 bg-blue-500 hover:bg-blue-600 transition text-white rounded-md font-semibold shadow"
              >
                Explore B2B Database
              </a>
            </div>
          </div>
        </div>
      </div>


      <div className="absolute bottom-0 left-0 w-full py-4">
        <div className="overflow-hidden marquee-fade">
          <div className="flex items-center gap-12 animate-marquee px-12">
            <img src="images/logos/logo-1.png" className="h-8 opacity-80" alt="Logo 1" />
            <img src="images/logos/logo-2.png" className="h-8 opacity-80" alt="Logo 2" />
            <img src="images/logos/logo-3.png" className="h-8 opacity-80" alt="Logo 3" />
            <img src="images/logos/logo-4.png" className="h-8 opacity-80" alt="Logo 4" />
            <img src="images/logos/logo-5.png" className="h-8 opacity-80" alt="Logo 5" />
            <img src="images/logos/logo-6.png" className="h-8 opacity-80" alt="Logo 6" />
            <img src="images/logos/logo-7.png" className="h-8 opacity-80" alt="Logo 7" />
            <img src="images/logos/logo-8.png" className="h-8 opacity-80" alt="Logo 8" />
            <img src="images/logos/logo-9.png" className="h-8 opacity-80" alt="Logo 9" />
            <img src="images/logos/logo-10.png" className="h-8 opacity-80" alt="Logo 10" />
            <img src="images/logos/logo-11.png" className="h-8 opacity-80" alt="Logo 11" />

            <img src="images/logos/logo-1.png" className="h-8 opacity-80" alt="Logo 1" />
            <img src="images/logos/logo-2.png" className="h-8 opacity-80" alt="Logo 2" />
            <img src="images/logos/logo-3.png" className="h-8 opacity-80" alt="Logo 3" />
            <img src="images/logos/logo-4.png" className="h-8 opacity-80" alt="Logo 4" />
            <img src="images/logos/logo-5.png" className="h-8 opacity-80" alt="Logo 5" />
             <img src="images/logos/logo-6.png" className="h-8 opacity-80" alt="Logo 6" />
            <img src="images/logos/logo-7.png" className="h-8 opacity-80" alt="Logo 7" />
            <img src="images/logos/logo-8.png" className="h-8 opacity-80" alt="Logo 8" />
            <img src="images/logos/logo-9.png" className="h-8 opacity-80" alt="Logo 9" />
            <img src="images/logos/logo-10.png" className="h-8 opacity-80" alt="Logo 10" />
          </div>
        </div>
      </div>
    </section>
  );
}
