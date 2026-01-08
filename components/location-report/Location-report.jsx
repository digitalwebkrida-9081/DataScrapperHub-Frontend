'use client';

import React, { useState } from 'react';
import { FaSearch, FaFilter, FaCheckCircle, FaGlobe, FaDatabase, FaEnvelope, FaPhone, FaArrowRight, FaChartLine, FaUserFriends, FaBuilding } from 'react-icons/fa';
import { MdKeyboardArrowDown, MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

const Locationreport = () => {
    // Mock data for the links list
    const regionLinks = [
        "Business Leads in Asia (5416)",
        "Business Leads in South America (5106)",
        "Business Leads in Asia (5416)",
        "Business Leads in South America (5106)",
        "Business Leads in Asia (5416)",
        "Business Leads in South America (5106)",
        "Business Leads in Asia (5416)",
        "Business Leads in South America (5106)",
        "Business Leads in Asia (5416)",
        "Business Leads in South America (5106)",
        "Business Leads in Europe (5300)",
        "Business Leads in Africa (5100)",
        "Business Leads in Europe (5300)",
        "Business Leads in Africa (5100)",
        "Business Leads in Europe (5300)",
        "Business Leads in Africa (5100)",
        "Business Leads in Europe (5300)",
        "Business Leads in Africa (5100)",
        "Business Leads in Europe (5300)",
        "Business Leads in Africa (5100)",
        "Business Leads in North America (6270)",
        "Business Leads in Oceania (6082)",
        "Business Leads in North America (6270)",
        "Business Leads in Oceania (6082)",
        "Business Leads in North America (6270)",
        "Business Leads in Oceania (6082)",
        "Business Leads in North America (6270)",
        "Business Leads in Oceania (6082)",
        "Business Leads in North America (6270)",
        "Business Leads in Oceania (6082)",
    ];

    return (
        <div className="bg-white min-h-screen font-sans text-slate-800">
            {/* --- HERO SECTION --- */}
            <div className="relative bg-[#0a1f44] text-white pt-24 pb-32 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-3/4 h-full pointer-events-none">
                     <svg className="absolute right-0 top-0 h-full w-auto opacity-10" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="200" cy="200" r="150" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
                        <circle cx="200" cy="200" r="250" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
                    </svg>
                </div>

                <div className="container mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center justify-between">
                    <div className="lg:w-1/2 mb-12 lg:mb-0">
                        <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
                            We have compiled a list of well-<br />
                            known websites for <span className="text-blue-400">web<br /> scraping</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-lg leading-relaxed">
                            A detailed list of businesses with email and phone lists across different domains.
                        </p>
                    </div>
                    
                    {/* Hero Illustration - Using the specific card look from the image */}
                    <div className="lg:w-1/2 flex justify-center relative">
                        {/* Blue Blob Background */}
                        <div className="absolute inset-0 bg-blue-600/20 blur-3xl rounded-full transform scale-75"></div>
                        
                        <div className="text-slate-800 p-4 rounded-xl shadow-2xl relative z-10 max-w-sm w-full">
                            <img src="/images/location-hero.png" alt="Hero-img" />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- BADGES / ACCOLADES --- */}
            <div className="container mx-auto px-4 -mt-16 relative z-20">
                <div className="flex flex-wrap justify-center gap-6">
                     <img src="/images/mid-image.png" alt="" />
                </div>
            </div>

            {/* --- DIRECTORY SECTION --- */}
            <div className="bg-white py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold text-slate-900">
                            List of websites for your <span className="text-blue-600">web scraping & data extraction</span> needs
                        </h2>
                    </div>

                    <div className="max-w-4xl mx-auto mb-12">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Select Category</label>
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="text" placeholder="Search Category" className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm" />
                                    <MdKeyboardArrowDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Select Country</label>
                                <div className="relative">
                                    <input type="text" placeholder="United States" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" />
                                     <MdKeyboardArrowDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-y-2 gap-x-8 text-xs text-slate-600 max-w-6xl mx-auto mb-12">
                        {regionLinks.map((link, i) => (
                            <div key={i} className="flex items-center gap-2 py-1">
                                <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
                                <a href="#" className="hover:text-blue-600 hover:underline">{link}</a>
                            </div>
                        ))}
                    </div>

                    {/* Pagination - Visual Only */}
                    <div className="flex justify-center items-center gap-2">
                         <button className="w-8 h-8 flex items-center justify-center rounded bg-slate-100 text-slate-400 text-sm"><MdKeyboardArrowLeft/></button>
                         <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white text-sm font-bold shadow-md shadow-blue-600/20">1</button>
                         <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-50 text-blue-600 text-sm font-medium">2</button>
                         <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-50 text-blue-600 text-sm font-medium">3</button>
                         <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-50 text-blue-600 text-sm font-medium">4</button>
                         <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-50 text-blue-600 text-sm font-medium">5</button>
                         <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-100 text-blue-600 text-sm"><MdKeyboardArrowRight/></button>
                    </div>
                </div>
            </div>

            {/* --- STATS / VALUE PROP --- */}
            <div className="bg-white py-16">
                 <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                         <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">WHY DATASCRAPERHUB?</p>
                         <h3 className="text-3xl font-bold mb-4">Beyond Just Leads</h3>
                         <p className="text-slate-500 max-w-3xl mx-auto text-sm">
                             Maximize the potential of your marketing, sales, analytics, and operations with exclusive, high-quality leads.
                             Reduce time spent on lead sourcing and focus on high-impact initiatives.
                         </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        <div className="bg-blue-600 text-white p-8 rounded-xl relative overflow-hidden group min-h-[200px] flex flex-col justify-center">
                           <div className="relative z-10">
                                <h4 className="text-lg font-medium opacity-90 mb-2">Close Faster</h4>
                                <div className="text-5xl font-bold mb-2">62%</div>
                                <p className="text-xs opacity-75">Increase in overall productivity</p>
                           </div>
                            <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-1/4 translate-y-1/4">
                                <FaArrowRight className="text-9xl rotate-45" />
                            </div>
                        </div>
                         <div className="bg-blue-600 text-white p-8 rounded-xl relative overflow-hidden group min-h-[200px] flex flex-col justify-center">
                           <div className="relative z-10">
                                <h4 className="text-lg font-medium opacity-90 mb-2">Gain Insights</h4>
                                <div className="text-5xl font-bold mb-2">3x</div>
                                <p className="text-xs opacity-75">Increase in win rates</p>
                           </div>
                           <FaChartLine className="absolute bottom-4 right-4 text-blue-400 text-8xl opacity-30" />
                        </div>
                         <div className="bg-blue-600 text-white p-8 rounded-xl relative overflow-hidden group min-h-[200px] flex flex-col justify-center">
                           <div className="relative z-10">
                                <h4 className="text-lg font-medium opacity-90 mb-2">Attract Customers</h4>
                                <div className="text-5xl font-bold mb-2">74%</div>
                                <p className="text-xs opacity-75">Decrease in marketing spend</p>
                           </div>
                           <div className="absolute right-[-20px] bottom-[-20px] opacity-20">
                                <div className="w-40 h-40 border-8 border-white rounded-full"></div>
                           </div>
                        </div>
                    </div>
                 </div>
            </div>

            {/* --- CTA SECTION --- */}
            <div className="bg-white py-24">
                <div className="container mx-auto px-4">
                    <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="md:w-3/5">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">
                                Harness the Power of <span className="text-blue-600">DataScraperHub</span>
                            </h2>
                            <p className="text-slate-600 text-sm mb-8 leading-relaxed">
                                Our web scraping services collect data and convert it into standardized CSV, Excel, and JSON formats. We deliver accurate, fast data scraping to meet the high-volume needs of enterprises. These samples illustrate the breadth of our web scraping capabilities across industries. We can extract data for any business sector.
                            </p>
                            <button className="bg-blue-600 text-white px-8 py-3.5 rounded font-semibold shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition flex items-center gap-2">
                                Contact Our Experts Now
                            </button>
                        </div>
                        <div className="md:w-2/5 flex justify-center">
                            {/* Illustration placeholder */}
                            <img src="/images/vector/team-illustration.png" alt="Data Illustration" className="w-full max-w-xs grayscale opacity-80" />
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default Locationreport;
