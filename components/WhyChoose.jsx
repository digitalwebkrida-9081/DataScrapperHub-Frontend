export default function BeyondJustLeads() {
  return (
    <section className="py-20 bg-white pt-10">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
            Why SmartScrapers?
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-gray-900">
            Beyond Just Leads
          </h2>
          <p className="mt-4 text-gray-500 leading-relaxed">
            Maximize the potential of your marketing, sales, analytics, and operations
            with exclusive, high-quality leads. Reduce time spent on lead sourcing and
            focus on high-impact initiatives.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
            <p className="text-sm font-medium">Close Faster</p>
            <h3 className="mt-4 text-3xl font-bold">62%</h3>
            <p className="mt-2 text-sm opacity-90">
              Increase in overall productivity
            </p>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_40%)]" />
          </div>

          {/* Card 2 */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
            <p className="text-sm font-medium">Gain Insights</p>
            <h3 className="mt-4 text-3xl font-bold">3x</h3>
            <p className="mt-2 text-sm opacity-90">
              Increase in win rates
            </p>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.35),transparent_40%)]" />
          </div>

          {/* Card 3 */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
            <p className="text-sm font-medium">Attract Customers</p>
            <h3 className="mt-4 text-3xl font-bold">74%</h3>
            <p className="mt-2 text-sm opacity-90">
              Decrease in marketing spend
            </p>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.35),transparent_45%)]" />
          </div>

        </div>

        {/* Info Banner */}
        <div className="mt-20 bg-[#F7FAFF] border border-blue-100 rounded-2xl p-10 flex flex-col lg:flex-row items-center gap-10 relative overflow-hidden">
          
          {/* Left Content */}
          <div className="flex-1 max-w-xl">
            <h3 className="text-2xl font-semibold text-gray-900">
              Harness the Power of{" "}
              <span className="text-[#3067FF]">DataScraperHub</span>
            </h3>

            <p className="mt-4 text-[#425466] leading-relaxed">
              Our web scraping services collect data and convert it into standardized
              CSV, Excel, and JSON formats. We deliver accurate, fast data scraping to
              meet the high-volume needs of enterprises. These samples illustrate the
              breadth of our web scraping capabilities across industries. We can extract
              data for any business sector.
            </p>

            <button className="mt-6 inline-flex items-center px-6 py-3 bg-[#3067FF] text-white text-sm font-medium rounded-lg hover:bg-[#254eda] transition">
              Contact Our Experts Now
            </button>
          </div>

          {/* Right Illustration */}
          <div className="flex-1 flex justify-center">
            <img
              src="images/vector/team-illustration.png"
              alt=" Team collaboration"
              className="w-full max-w-[360px] object-contain"
            />
          </div>

          {/* Bottom Accent Line */}
          <span className="absolute bottom-0 left-0 w-full h-1 bg-[#3067FF]" />
        </div>

      </div>
    </section>
  );
}
