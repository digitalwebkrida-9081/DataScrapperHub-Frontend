const services = [
  {
    image: "images/svg/1.svg",
    title: "Real Estate Data Scraping",
    desc: "Access property listings, pricing, historical trends, agent details, and sales records. Our real estate and housing data scraping services gather information from thousands of global sources.",
  },
  {
    image: "images/svg/2.svg",
    title: "Sales Lead Generation Data",
    desc: "Obtain targeted company, contact, email, and phone number lists for your industry. Outsource sales lead data collection and prioritize lead nurturing efforts.",
  },
  {
    image: "images/svg/3.svg",
    title: "Financial Data Scraping",
    desc: "Harness extensive datasets spanning pricing, volume, sentiment, news, social media, and more. Our finance market data scraping offers current and historical insights for public companies.",
  },
  {
    image: "images/svg/4.svg",
    title: "Financial Data Extraction",
    desc: "Harness extensive datasets spanning pricing, volume, sentiment, news, social media, and more. Our finance market data scraping offers current and historical insights for public companies.",
  },
  {
    image: "images/svg/5.svg",
    title: "Ecommerce",
    desc: "Gather product details, pricing, reviews, ratings, and inventory from leading e-commerce platforms. Our e-commerce data scraping services help you monitor competitors and optimize your offerings.",
  },
  {
    image: "images/svg/6.svg",
    title: "Recruitment",
    desc: "Track job postings, company profiles, candidate resumes, and more. Stay competitive with our recruitment data scraping services.",
  },
  {
    image: "images/svg/7.svg",
    title: "Brand Monitoring",
    desc: "Safeguard your brand by monitoring millions of e-commerce sites for counterfeit products and seller contact information. Our high-frequency scraping protects brand value.",
  },
  {
    image: "images/svg/12.svg",
    title: "Workflow Automation",
    desc: "Streamline data entry with OCR, custom pipelines, and data management tools. Reclaim countless hours through intelligent workflow automation data services.",
  },
  {
    image: "images/svg/8.svg",
    title: "Research and Journalism",
    desc: "Acquire comprehensive datasets on virtually any subject to support your research and reporting. Our web and data scraping services provide the foundation for compelling insights.",
  },
  {
    image: "images/svg/9.svg",
    title: "Manufacturing",
    desc: "Strengthen production processes with intelligence on equipment, parts, vendors, competitors, and quality control. Drive well-informed decisions at every manufacturing stage.",
  },
  {
    image: "images/svg/10.svg",
    title: "News monitoring",
    desc: "Acquire reliable, structured news data from social media, publications, blogs, reviews, and additional sources. Stay current with local and global events through multi-source news monitoring data.",
  },
  {
    image: "images/svg/11.svg",
    title: "Retail",
    desc: "Obtain extensive location data including product details, contact information, pickup options, and store amenities. Boost retail market insights with our location intelligence and geographical data scraping.",
  }
];

export default function ServicesGrid() {
  return (
    <section className="py-20 bg-[#EBF3FF]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center">Discover Our B2B Database</h2>
        <p className="text-center text-gray-600 mt-2">
          Empowering businesses with web and data scraping. Web scraping solutions transform unstructured online data into structured, actionable insights that drive business value across applications and departments.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {services.map((s, i) => (
            <div key={i} className="p-6 border-red-200 rounded-lg shadow-lg bg-gray-50">
              <img src={s.image} alt="" className=" bg-white-200 border-1 rounded-lg h-15 p-2"/>
              <h3 className="font-semibold text-lg pt-2">{s.title}</h3>
              <p className="mt-2 text-gray-600">{s.desc}</p>
              <button className="mt-4 text-[#3067FF] font-semibold cursor-pointer">Learn More</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
