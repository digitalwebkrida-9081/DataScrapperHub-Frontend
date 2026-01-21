import Link from "next/link";

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
              <Link
                href="/b2b"
                className="inline-flex items-center px-5 py-3 bg-blue-500 hover:bg-blue-600 transition text-white rounded-md font-semibold shadow"
              >
                Explore B2B Database
              </Link>
            </div>
          </div>
        </div>
      </div>


      
    </section>
  );
}
