const trusted = [
  { image: "images/svg/w1.svg", desc: "Trusted by 76 out of Fortune 500 companies for workflow automation and data collection" },
  { image: "images/svg/w2.svg", desc: "Trusted by some of the most valuable brands in the world for protection against counterfeits" },
  { image: "images/svg/w3.svg", desc: "Trusted by some of the largest real estate investments firms" },
  { image: "images/svg/w4.svg", desc: "Trusted by thousands of startups and established enterprises for sales data mining" },
  { image: "images/svg/w5.svg", desc: "Trusted by top 10 e-commerce companies to get insight into competitor’s products" },
  { image: "images/svg/w6.svg", desc: "Trusted by top researchers and journalist to source data" },
  { image: "images/svg/w7.svg", desc: "Trusted by some of the largest recruitment firms" },
];

export default function Trusted() {
  return (
    <section className="py-20 bg-white pb-10">
      <div className="max-w-7xl mx-auto px-6 text-center">
        
        <h2 className="text-3xl font-semibold text-gray-900">
          Trusted by Industry Leaders
        </h2>

        <p className="mt-4 max-w-3xl mx-auto text-gray-500 border-b border-[#F3F3F3] pb-6">
          Web scraping solutions empower businesses to extract online data and transform it
          into structured insights that drive value across applications, fuelling growth and innovation.
        </p>

        {/* ROW 1 — 2 cards */}
        <div className="mt-12 flex flex-wrap justify-center gap-6">
          {trusted.slice(0, 2).map((s, i) => (
            <Card key={i} {...s} />
          ))}
        </div>

        {/* ROW 2 — 3 cards */}
        <div className="mt-6 flex flex-wrap justify-center gap-6">
          {trusted.slice(2, 5).map((s, i) => (
            <Card key={i} {...s} />
          ))}
        </div>

        {/* ROW 3 — 2 cards */}
        <div className="mt-6 flex flex-wrap justify-center gap-6">
          {trusted.slice(5, 7).map((s, i) => (
            <Card key={i} {...s} />
          ))}
        </div>

      </div>
    </section>
  );
}

function Card({ image, desc }) {
  return (
    <div className="w-[360px] bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
      
      {/* Icon Wrapper */}
      <div className="p-3 w-20 h-12 flex items-center justify-center rounded-lg bg-blue-600 shadow-[0px_11px_22px_rgba(48,103,255,0.20)] overflow-hidden">
        <img
          src={image}
          alt=""
          className="w-16 h-10 object-contain"
          draggable={false}
        />
      </div>

      {/* Text */}
      <p className="text-left text-sm text-[#425466] leading-relaxed">
        {desc}
      </p>

    </div>
  );
}

