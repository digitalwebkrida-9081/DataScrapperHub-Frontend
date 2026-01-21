export default function DataDelivery() {
  return (
    <section className="py-20 pt-0 bg-white">
      <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-14">

        {/* First Part */}
        {/* LEFT: Image / Diagram */}
        <div className="flex-1 flex justify-center">
          <img
            src="images/vector/data-delivery-image-1.png"
            alt="Customizable data formats"
            className="w-full max-w-[520px] object-contain"
          />
        </div>

        {/* RIGHT: Content */}
        <div className="flex-1 max-w-xl">
          <h2 className="text-3xl font-semibold text-gray-900">
            Customizable Data Structuring and Formatting
          </h2>

          <p className="mt-5 text-[#425466] text-base leading-relaxed">
            DataSellerHub scrapes and transforms data into your preferred
            structure and format, including TXT, PDF, Image, JSON, FTP, API,
            and CSV, streamlining integration with your business processes.
          </p>

          <button className="mt-8 inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-[#3067FF] rounded-lg shadow-sm hover:bg-[#254eda] transition">
            CONTACT SALES
          </button>
        </div>

      </div>

      {/* Second Part */}
      <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-14 pt-10">
        {/* RIGHT: Content */}
        <div className="flex-1 max-w-xl">
          <h2 className="text-3xl font-semibold text-gray-900">
            Secure Data Delivery to Your Preferred Location
          </h2>

          <p className="mt-5 text-[#425466] text-base leading-relaxed">
            We ensure smooth, secure data delivery to any specified location, upholding the highest standards of data confidentiality and integrity.
          </p>

          <button className="mt-8 inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-[#3067FF] rounded-lg shadow-sm hover:bg-[#254eda] transition">
            CONTACT SALES
          </button>
        </div>

        {/* LEFT: Image / Diagram */}
        <div className="flex-1 flex justify-center">
          <img
            src="images/vector/data-delivery-image-2.png"
            alt="Customizable data formats"
            className="w-full max-w-[520px] object-contain"
          />
        </div>

        

      </div>
    </section>
  );
}
