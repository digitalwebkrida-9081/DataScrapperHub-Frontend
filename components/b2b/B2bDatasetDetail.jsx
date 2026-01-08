'use client';

import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaStar, FaDownload, FaChartLine, FaLock, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe, FaBuilding, FaUser, FaTimes, FaShoppingCart } from 'react-icons/fa';
import { MdVerified, MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import Link from 'next/link';

const B2bDatasetDetail = ({ id }) => {
    const [dataset, setDataset] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phoneNumber: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handlePurchase = (e) => {
        e.preventDefault();
        alert(`Purchase initiated for ${form.fullName}. This is a simulation.`);
        setIsModalOpen(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. First check if it's a simulated dataset in sessionStorage
                const cachedSimulated = sessionStorage.getItem('simulatedDatasets');
                if (cachedSimulated) {
                    const simulatedList = JSON.parse(cachedSimulated);
                    const found = simulatedList.find(s => s.id === id || s._id === id);
                    if (found) {
                        setDataset(found);
                        setLoading(false);
                        return;
                    }
                }

                // 2. Fallback to API for real database records
                const response = await fetch(`http://localhost:5000/api/b2b-leads/${id}`);
                
                if (!response.ok) throw new Error('Failed to fetch');
                const result = await response.json();
                
                // Handle successResponse wrapper { data: ..., message: ... }
                const datasetData = result.data || result;
                
                if (datasetData) {
                     setDataset(datasetData);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching detail data:", error);
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading dataset details...</div>;
    }

    if (!dataset) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">Dataset not found.</div>;
    }

    return (
        <div className="bg-white min-h-screen font-sans text-slate-800">
            {/* --- HERO SECTION --- */}
            <div className="bg-[#0a1f44] text-white pt-24 pb-20 relative overflow-hidden">
                 {/* Background decoration */}
                 <div className="absolute top-0 right-0 p-10 opacity-10">
                    <svg width="300" height="300" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="2" />
                        <path d="M50 10 L50 90 M10 50 L90 50" stroke="white" strokeWidth="2" />
                    </svg>
                </div>

                <div className="container mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center justify-between">
                    <div className="lg:w-3/5 mb-10 lg:mb-0">
                         <div className="text-sm text-blue-300 mb-4 flex gap-2">
                             <Link href="/" className="hover:underline">Home</Link> / 
                             <Link href="/b2b" className="hover:underline">B2B Database</Link> / 
                             <span className="text-white">{dataset.category}</span>
                         </div>
                        <h1 className="text-3xl lg:text-5xl font-bold mb-4 leading-tight">
                            List of <span className="text-blue-400">{dataset.category}</span> in {dataset.location}
                        </h1>
                        <p className="text-slate-300 text-lg mb-6 max-w-2xl">
                            Download the verified list of {dataset.category} with contact info (Phone, Email), provided directly to you for cold outreach.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 mb-8 text-sm">
                            <div className="flex items-center gap-2 text-green-400">
                                <FaCheckCircle /> <span>{dataset.totalRecords} Phone verified listing stores</span>
                            </div>
                            <div className="flex items-center gap-2 text-green-400">
                                <FaCheckCircle /> <span>{dataset.emailCount} Email verified stores</span>
                            </div>
                            <div className="flex items-center gap-2 text-green-400">
                                <FaCheckCircle /> <span>100% Data Accuracy Guarantee</span>
                            </div>
                        </div>

                         <div className="flex items-center gap-4 mb-6">
                             <span className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold uppercase">Best Value</span>
                             <span className="text-slate-400 text-sm">Update: {dataset.lastUpdate}</span>
                         </div>

                        <div className="flex gap-4 items-center">
                            <div className="text-4xl font-bold">{dataset.price}</div>
                            <div className="text-slate-400 line-through text-lg">$599 (50% Off)</div>
                        </div>
                        
                         <div className="mt-8 flex gap-4">
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition shadow-lg shadow-blue-600/30 cursor-pointer"
                            >
                                <FaDownload /> Buy & Download Now
                            </button>
                             <button
                             onClick={() => setIsModalOpen(true)}
                             className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition cursor-pointer">
                                <FaDownload /> Download Sample
                            </button>
                        </div>
                    </div>
                    
                    {/* Hero Illustration */}
                    <div className="lg:w-2/5 flex justify-center">
                        <img src="/images/b2b-hero.png" alt="Data Illustration" className="w-full max-w-md" />
                    </div>
                </div>
            </div>

             {/* Logo Bar */}
            <div className="bg-[#0f2a5a] py-6 border-b border-white/10">
                <div className="container mx-auto px-4 flex justify-between items-center opacity-40 grayscale filter gap-8 overflow-x-auto">
                    {/* Reusing logos or placeholders */}
                     <span className="text-white font-bold text-xl">Walmart</span>
                     <span className="text-white font-bold text-xl">JLL</span>
                     <span className="text-white font-bold text-xl">Citi</span>
                     <span className="text-white font-bold text-xl">KPMG</span>
                     <span className="text-white font-bold text-xl">Kroger</span>
                </div>
            </div>

            {/* --- DATA TABLE SECTION --- */}
            <div className="bg-[#0a1f44] py-16">
                 <div className="container mx-auto px-4">
                     <div className="text-center mb-10">
                         <h2 className="text-2xl font-bold text-white">List of {dataset.category} in {dataset.location}</h2>
                         <p className="text-slate-400 text-sm mt-2">A preview of the data fields included in the downloaded list.</p>
                     </div>

                     <div className="bg-white rounded-lg overflow-hidden shadow-2xl overflow-x-auto">
                         <table className="w-full text-left text-xs md:text-sm">
                             <thead className="bg-blue-50 text-blue-900 font-bold uppercase border-b border-blue-100">
                                 <tr>
                                     <th className="p-3 whitespace-nowrap">Name</th>
                                     <th className="p-3 whitespace-nowrap">Address</th>
                                     <th className="p-3 whitespace-nowrap">City</th>
                                     <th className="p-3 whitespace-nowrap">State/Province</th>
                                     <th className="p-3 whitespace-nowrap">Country</th>
                                     <th className="p-3 whitespace-nowrap">Email</th>
                                     <th className="p-3 whitespace-nowrap">Phone</th>
                                     <th className="p-3 whitespace-nowrap">Rating (0-5)</th>
                                     <th className="p-3 whitespace-nowrap">Reviews</th>
                                     <th className="p-3 whitespace-nowrap text-center">Action</th>
                                 </tr>
                             </thead>
                             <tbody>
                                 {dataset.sampleList.map((row, idx) => (
                                     <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                         <td className="p-3 font-medium text-slate-700">{row.name}</td>
                                         <td className="p-3 text-slate-500 truncate max-w-[150px]">{row.address}</td>
                                         <td className="p-3 text-slate-500">{row.city}</td>
                                         <td className="p-3 text-slate-500">{row.state}</td>
                                         <td className="p-3 text-slate-500">{row.country}</td>
                                         <td className="p-3 text-slate-500 flex items-center gap-1"><MdEmail className="text-blue-400"/> {row.email ? 'Available' : '--'}</td>
                                         <td className="p-3 text-slate-500 flex items-center gap-1"><MdPhone className="text-green-500"/> {row.phone ? 'Available' : '--'}</td>
                                         <td className="p-3 text-slate-500">{row.rating}</td>
                                         <td className="p-3 text-slate-500">{row.reviews}</td>
                                         <td className="p-3 text-center">
                                             <FaLock className="inline text-slate-300" />
                                         </td>
                                     </tr>
                                 ))}
                             </tbody>
                         </table>
                         <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
                             <div className="flex gap-4 justify-center">
                                <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-blue-600 text-white px-6 py-2 rounded text-sm font-bold shadow-md hover:bg-blue-700 transition cursor-pointer">
                                    <FaDownload className="inline mr-2"/> Download Full List
                                </button>
                                 <button
                                 onClick={() => setIsModalOpen(true)}
                                 className="bg-white border border-slate-300 text-slate-700 px-6 py-2 rounded text-sm font-bold hover:bg-slate-50 transition cursor-pointer">
                                    Request Sample
                                </button>
                             </div>
                         </div>
                     </div>
                 </div>
            </div>

            {/* --- VALUE PROPOSITION SECTION --- */}
            <div className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-2xl font-bold text-slate-900">How DataScraperHub Data Services Helps Businesses</h2>
                        <p className="text-slate-500 mt-2">Explore the strategic advantages of our data scraping solutions for your business.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="bg-slate-50 p-8 rounded-xl border border-slate-100 hover:shadow-lg transition">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm mb-6 text-2xl text-blue-600">
                                <FaEnvelope />
                            </div>
                            <h3 className="font-bold text-lg mb-3">Re-target Your Email Campaigns</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Our verified lists ensure high deliverability rates. Reach the right inbox at the right time. Segment your lists and personalize content for maximum engagement and conversion.
                            </p>
                        </div>
                        {/* Card 2 */}
                        <div className="bg-slate-50 p-8 rounded-xl border border-slate-100 hover:shadow-lg transition">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm mb-6 text-2xl text-purple-600">
                                <FaLock />
                            </div>
                            <h3 className="font-bold text-lg mb-3">Master Your Cold Calling Impact</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Avoid gatekeepers with direct dial numbers. Our data includes key decision-maker information, empowering your sales team to have more meaningful conversations.
                            </p>
                        </div>
                        {/* Card 3 */}
                        <div className="bg-slate-50 p-8 rounded-xl border border-slate-100 hover:shadow-lg transition">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm mb-6 text-2xl text-green-600">
                                <FaMapMarkerAlt />
                            </div>
                            <h3 className="font-bold text-lg mb-3">Hack Your Direct Mail Campaigns</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Physical mail is making a comeback. Use our precise address data to send physical offers, samples, or brochures directly to business locations in specific regions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- STATS SECTION --- */}
            <div className="py-16 bg-slate-50">
                 <div className="container mx-auto px-4 border-b border-slate-200 pb-16">
                     <div className="text-center mb-12">
                         <h2 className="text-2xl font-bold">How many List of {dataset.category} are there in the {dataset.location}?</h2>
                         <p className="text-slate-500 mt-2">There are a total of {dataset.totalRecords} {dataset.category} stores in {dataset.location} as of {dataset.lastUpdate}.</p>
                         
                         <div className="mt-8 flex justify-center gap-4">
                             <button className="bg-blue-600 text-white px-6 py-2 rounded font-bold text-sm">Buy Full Dataset</button>
                             <button className="bg-slate-800 text-white px-6 py-2 rounded font-bold text-sm flex items-center gap-2"><FaDownload/> Download Sample</button>
                         </div>
                     </div>
                     
                     <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center">
                            <div className="text-blue-600 text-4xl mb-4 flex justify-center"><FaPhone/></div>
                            <h4 className="font-bold text-slate-700 mb-2">Number of phone numbers in the list</h4>
                            <div className="text-5xl font-black text-slate-800 mb-4">{dataset.totalRecords}</div>
                            <button className="text-xs uppercase font-bold border border-slate-300 px-4 py-1 rounded text-slate-500">View Data Availability</button>
                        </div>
                         <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center">
                            <div className="text-blue-600 text-4xl mb-4 flex justify-center"><MdEmail/></div>
                            <h4 className="font-bold text-slate-700 mb-2">Number of email addresses in the list</h4>
                            <div className="text-5xl font-black text-slate-800 mb-4">{dataset.emailCount}</div>
                            <button className="text-xs uppercase font-bold border border-slate-300 px-4 py-1 rounded text-slate-500">View Data Availability</button>
                        </div>
                     </div>

                     <div className="mt-12 flex flex-col md:flex-row gap-6 max-w-4xl mx-auto">
                         <div className="flex-1 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-6 text-white relative overflow-hidden">
                             <div className="relative z-10">
                                 <h4 className="font-bold mb-1">Store Owner</h4>
                                 <p className="text-sm opacity-80">Available</p>
                             </div>
                             <FaUser className="absolute bottom-4 right-4 text-6xl opacity-20" />
                         </div>
                          <div className="flex-1 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-6 text-white relative overflow-hidden">
                             <div className="relative z-10">
                                 <h4 className="font-bold mb-1">Facility Owner</h4>
                                 <p className="text-sm opacity-80">Available</p>
                             </div>
                             <FaBuilding className="absolute bottom-4 right-4 text-6xl opacity-20" />
                         </div>
                     </div>
                 </div>

                 {/* Unlock Monthly Insights */}
                 <div className="container mx-auto px-4 py-16 text-center">
                     <h2 className="text-2xl font-bold mb-8">Unlock Monthly Insights for Market Analysis and Explosive Growth</h2>
                     <div className="space-y-4 max-w-2xl mx-auto">
                         <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 text-sm font-medium text-slate-600">
                             Unlock data on new clothing stores opening near you every 30 days.
                         </div>
                          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 text-sm font-medium text-slate-600">
                             Track competitors and analyze market saturation in real-time.
                         </div>
                          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 text-sm font-medium text-slate-600">
                             Leverage predictive analytics to forecast trend shifts in your locale.
                         </div>
                          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 text-sm font-medium text-slate-600">
                             Gain competitive edge with up-to-date contact information.
                         </div>
                     </div>
                 </div>
            </div>

            {/* --- SPECIAL FEATURES --- */}
            <div className="bg-blue-50/50 py-16">
                 <div className="container mx-auto px-4">
                     <div className="text-center mb-10">
                         <h2 className="text-2xl font-bold">Special Features</h2>
                     </div>
                     <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl flex items-center gap-4 shadow-sm">
                            <div className="bg-blue-100 p-3 rounded-lg text-blue-600"><FaCheckCircle/></div>
                            <div className="text-xs font-bold text-slate-600">Verified Email & Phone</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl flex items-center gap-4 shadow-sm">
                            <div className="bg-blue-100 p-3 rounded-lg text-blue-600"><FaChartLine/></div>
                            <div className="text-xs font-bold text-slate-600">Historical Data Available</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl flex items-center gap-4 shadow-sm">
                            <div className="bg-blue-100 p-3 rounded-lg text-blue-600"><FaGlobe/></div>
                            <div className="text-xs font-bold text-slate-600">Global Coverage Options</div>
                        </div>
                     </div>
                 </div>
            </div>
            
            {/* Reusing existing footer or relying on Layout for Footer */}
            {/* --- PURCHASE MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
                        {/* Close button */}
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
                        >
                            <FaTimes className="text-xl" />
                        </button>

                        {/* Logo */}
                        <div className="flex justify-center mb-6">
                            <div className="flex items-center gap-2 text-slate-900 font-bold text-2xl">
                                {/* <div className="w-8 h-8 bg-gradient-to-tr from-orange-400 to-purple-600 rounded-full flex items-center justify-center">
                                    <div className="w-4 h-4 bg-white rounded-full"></div>
                                </div> */}
                                <img src="/images/logo.jpg" alt="logo" className='w-10 ' />
                                Data Scraper Hub
                            </div>
                        </div>

                        {/* Title */}
                        <div className="text-center mb-8">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                Purchase lead list of <span className="text-blue-600">{dataset.category}</span> in <span className="text-blue-600">{dataset.location}</span> ({dataset.price})
                            </h3>
                            <p className="text-slate-500 text-sm">Fill in the below details</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handlePurchase} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    name="fullName"
                                    required
                                    value={form.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Full Name"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="email" 
                                    name="email"
                                    required
                                    value={form.email}
                                    onChange={handleInputChange}
                                    placeholder="Email"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-2">
                                    <div className="flex items-center gap-2 px-3 border border-slate-200 rounded-xl bg-slate-50">
                                        <img src="https://flagcdn.com/w20/in.png" alt="IN" className="h-3" />
                                        <span className="text-sm text-slate-600">+91</span>
                                    </div>
                                    <input 
                                        type="tel" 
                                        name="phoneNumber"
                                        required
                                        value={form.phoneNumber}
                                        onChange={handleInputChange}
                                        placeholder="Phone Number"
                                        className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit"
                                className="w-full mt-6 bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition shadow-xl shadow-slate-900/20 group cursor-pointer"
                            >
                                <div className="w-8 h-8 bg-slate-700/50 rounded flex items-center justify-center group-hover:bg-slate-700 transition">
                                    <FaShoppingCart className="text-sm" />
                                </div>
                                BUY NOW
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default B2bDatasetDetail;
