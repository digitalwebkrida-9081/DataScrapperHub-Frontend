'use client';

import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaStar, FaDownload, FaChartLine, FaLock, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe, FaBuilding, FaUser, FaTimes, FaShoppingCart } from 'react-icons/fa';
import { MdVerified, MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import WhyChoose from '../WhyChoose';
import DatasetFaq from './DatasetFaq';
import * as XLSX from 'xlsx';
import dynamic from 'next/dynamic';
import { getCountryData, generateSimulatedDistribution } from '../../data/countryStates';

const CountryMapSection = dynamic(() => import('./CountryMapSection'), { ssr: false });

// Enrich dataset with simulated state distribution if backend didn't provide one
// Only for COUNTRY-level datasets (not state or city level)
const enrichWithMapData = (ds) => {
    // If backend already provided real state distribution data, use it
    if (ds.stateDistribution && Object.keys(ds.stateDistribution).length > 0 && ds.countryCode) {
        return ds;
    }
    // Only generate simulated data for country-level locations
    // Country-level = location is JUST a country name (e.g. "INDIA", "UNITED STATES")
    // State-level = "GUJARAT INDIA", City-level = "MUMBAI MAHARASHTRA INDIA" — skip these
    const loc = (ds.location || '').toLowerCase().trim();
    const countryInfo = getCountryData(loc);
    if (!countryInfo) return ds;

    // Exact match check: the normalized location must match a known country name exactly
    const knownCountries = [
        'india', 'united states', 'bangladesh', 'united kingdom', 'canada',
        'australia', 'germany', 'france', 'brazil', 'japan', 'mexico',
        'south africa', 'indonesia', 'italy', 'spain', 'turkey', 'pakistan',
        'nigeria', 'egypt', 'thailand', 'philippines', 'malaysia', 'saudi arabia',
        'uae', 'united arab emirates', 'south korea', 'nepal', 'sri lanka',
        'singapore', 'new zealand', 'netherlands', 'sweden', 'switzerland',
        'poland', 'argentina', 'colombia', 'chile', 'kenya'
    ];
    if (!knownCountries.includes(loc)) return ds; // Not a country-only location, skip

    const totalRecords = typeof ds.totalRecords === 'string'
        ? parseInt(ds.totalRecords.replace(/,/g, ''), 10)
        : ds.totalRecords;
    
    // Parse prices for calculation
    const rawPrice = ds.price ? String(ds.price).replace(/[^0-9.]/g, '') : '199';
    const rawPrev = ds.previousPrice ? String(ds.previousPrice).replace(/[^0-9.]/g, '') : '398';
    
    return {
        ...ds,
        price: parseFloat(rawPrice),
        previousPrice: parseFloat(rawPrev),
        countryCode: countryInfo.code,
        stateDistribution: generateSimulatedDistribution(countryInfo.states, totalRecords || 5000)
    };
};

const B2bDatasetDetail = ({ id }) => {
    const searchParams = useSearchParams();
    const displayLabel = searchParams.get('label');

    const [dataset, setDataset] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [purchaseLoading, setPurchaseLoading] = useState(false);
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phoneNumber: ''
    });
    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
    const [sampleForm, setSampleForm] = useState({
        fullName: '',
        email: '',
        phoneNumber: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSampleChange = (e) => {
        const { name, value } = e.target;
        setSampleForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSampleDownload = async (e) => {
        e.preventDefault();
        // Simulate processing
        setPurchaseLoading(true); // Reuse loading state or create new one if needed

        try {
            // Submit to Backend
            const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
            await fetch(`${API_URL}/api/forms/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'sample_request',
                    name: sampleForm.fullName,
                    email: sampleForm.email,
                    phone: sampleForm.phoneNumber,
                    datasetDetails: {
                         id: dataset.id,
                         category: dataset.category,
                         location: dataset.location
                    }
                })
            });
        } catch (error) {
            console.error("Error submitting sample request:", error);
        }
        
        setTimeout(() => {
            // Generate Excel File
            const wb = XLSX.utils.book_new();
            
            // Create data for Excel with masked/hidden fields
            const exportData = dataset.sampleList.map(item => ({
                "Business Name": item.name,
                "Address": item.address || "Available in Full List",
                "City": item.city,
                "State": item.state,
                "Country": item.country,
                "Phone": "Available in Full List (Verified)", // Masked
                "Email": "Available in Full List (Verified)", // Masked
                "Website": item.website ? "Available" : "--",
                "Rating": item.rating,
                "Reviews": item.reviews
            }));

            const ws = XLSX.utils.json_to_sheet(exportData);
            
            // Adjust column widths
            const wscols = [
                {wch: 30}, // Name
                {wch: 30}, // Address
                {wch: 15}, // City
                {wch: 15}, // State
                {wch: 15}, // Country
                {wch: 25}, // Phone
                {wch: 25}, // Email
                {wch: 20}, // Website
                {wch: 10}, // Rating
                {wch: 10}  // Reviews
            ];
            ws['!cols'] = wscols;

            XLSX.utils.book_append_sheet(wb, ws, "Sample Leads");
            
            // Download file
            XLSX.writeFile(wb, `${dataset.category}-${dataset.location}-SAMPLE.xlsx`);
            
            setPurchaseLoading(false);
            setIsSampleModalOpen(false);
            alert("Sample data downloaded successfully!");
        }, 1500);
    };

    const handlePurchase = async (e) => {
        e.preventDefault();
        setPurchaseLoading(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
            const response = await fetch(`${API_URL}/api/scraper/dataset/purchase`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: id,
                    ...form
                })
            });
            
            if (response.ok) {
                // Success: Download file
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${dataset.category}-${dataset.location}.xlsx`; 
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);

                alert(`Purchase Successful! Downloading file...`);
                setIsModalOpen(false);
            } else {
                // Failure: Parse JSON error
                const result = await response.json();
                alert(`Purchase Failed: ${result.message}`);
            }
        } catch (error) {
            console.error("Purchase error:", error);
            alert("An error occurred during purchase.");
        } finally {
            setPurchaseLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Try API first (Real Data from File System)
                const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
                try {
                    const response = await fetch(`${API_URL}/api/scraper/dataset/${id}`);
                    if (response.ok) {
                        const result = await response.json();
                        if (result.success && result.data) {
                             setDataset(enrichWithMapData(result.data));
                             setLoading(false);
                             return;
                        }
                    }
                } catch (e) {
                    console.warn("API Fetch failed, checking cache...", e);
                }

                // 2. Fallback to Simulated/Session Data
                const cachedSimulated = sessionStorage.getItem('simulatedDatasets');
                if (cachedSimulated) {
                    const simulatedList = JSON.parse(cachedSimulated);
                    const found = simulatedList.find(s => s.id === id || s._id === id);
                    if (found) {
                        setDataset(enrichWithMapData(found));
                        setLoading(false);
                        return;
                    }
                }
                
                // If both fail:
                console.error("Dataset not found in API or Cache");
                setLoading(false);
            } catch (error) {
                console.error("Error fetching detail data:", error);
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    // Auto-open sample popup with delay after dataset loads
    useEffect(() => {
        let timer;
        if (dataset && !loading) {
            timer = setTimeout(() => {
                setIsSampleModalOpen(true);
            }, 5000); // 5 second delay
        }
        return () => clearTimeout(timer);
    }, [dataset, loading]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading dataset details...</div>;
    }

    if (!dataset) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">Dataset not found.</div>;
    }

    return (
        <div className="bg-white min-h-screen font-sans text-slate-800">
            {/* --- HERO SECTION --- */}
            <div className="bg-[#05051a] text-white pt-15 pb-20 relative overflow-hidden font-sans">
                <div className="container mx-auto px-4 relative z-10">
                    {/* Breadcrumb */}
                    <div className="text-xs font-medium text-slate-400 mb-6 flex gap-2 items-center tracking-wide">
                         <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link> / 
                         <Link href="/b2b" className="hover:text-blue-400 transition-colors">B2B Database</Link> / 
                         <span className="text-slate-200">{dataset.category} in {dataset.location}</span>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* LEFT CONTENT */}
                        <div className="lg:w-[60%]">
                            <h1 className="text-2xl lg:text-4xl font-bold mb-6 leading-tight">
                                List of <span className="font-bold text-blue-500">{dataset.category}</span> {displayLabel ? `in ${displayLabel}` : dataset.location.split(',').slice(-2).join(',')}
                            </h1>
                            
                            <p className="text-slate-300 text-sm md:text-base mb-8 leading-relaxed">
                                There are <strong className="text-white">{dataset.totalRecords.toLocaleString()}</strong> {dataset.category} in {dataset.location} as of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}. 
                                Of these locations, {Math.floor(dataset.totalRecords * 0.95).toLocaleString()} {dataset.category} which is 95.89% of all {dataset.category} in {dataset.location} are single-owner operations.
                                The top three states with the most {dataset.category} are populated below. Average age of {dataset.category} in {dataset.location} is 3 years and 10 months.
                            </p>

                            {/* STATS GRID */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 mb-8 text-sm md:text-base">
                                 {/* Column 1 */}
                                 <div className="space-y-3">
                                     <div className="flex items-center gap-3">
                                         <FaCheckCircle className="text-green-500 shrink-0"/>
                                         <span className="font-bold text-white text-[18px]">{dataset.totalRecords.toLocaleString()}</span>
                                         <span className="text-slate-300">Number of {dataset.category}</span>
                                     </div>
                                     <div className="flex items-center gap-3">
                                         <FaCheckCircle className="text-green-500 shrink-0"/>
                                         <span className="font-bold text-white text-[18px]">{dataset.emailCount ? dataset.emailCount.toLocaleString() : Math.floor(dataset.totalRecords * 0.4).toLocaleString()}</span>
                                         <span className="text-slate-300 hover:text-white cursor-pointer hover:underline decoration-slate-500 underline-offset-4">Email Addresses</span>
                                     </div>
                                     <div className="flex items-center gap-3">
                                         <FaCheckCircle className="text-green-500 shrink-0"/>
                                         <span className="font-bold text-white text-[18px]">{dataset.phones ? dataset.phones.toLocaleString() : Math.floor(dataset.totalRecords * 0.85).toLocaleString()}</span>
                                         <span className="text-slate-300 hover:text-white cursor-pointer hover:underline decoration-slate-500 underline-offset-4">Phone Numbers</span>
                                     </div>
                                     <div className="flex items-center gap-3">
                                         <FaCheckCircle className="text-green-500 shrink-0"/>
                                         <span className="font-bold text-white text-[18px]">{Math.floor(dataset.totalRecords * 0.6).toLocaleString()}</span>
                                         <span className="text-slate-300 hover:text-white cursor-pointer hover:underline decoration-slate-500 underline-offset-4">With Websites</span>
                                     </div>
                                     <div className="flex items-center gap-3">
                                         <FaCheckCircle className="text-green-500 shrink-0"/>
                                         <span className="font-bold text-white text-[18px]">{Math.floor(dataset.totalRecords * 0.3).toLocaleString()}</span>
                                         <span className="text-slate-300 hover:text-white cursor-pointer hover:underline decoration-slate-500 underline-offset-4">LinkedIn Profiles</span>
                                     </div>
                                 </div>

                                 {/* Column 2 */}
                                 <div className="space-y-3">
                                     <div className="flex items-center gap-3">
                                         <FaCheckCircle className="text-green-500 shrink-0"/>
                                         <span className="font-bold text-white text-[18px]">{Math.floor(dataset.totalRecords * 0.55).toLocaleString()}</span>
                                         <span className="text-slate-300 hover:text-white cursor-pointer hover:underline decoration-slate-500 underline-offset-4">Facebook Profiles</span>
                                     </div>
                                     <div className="flex items-center gap-3">
                                         <FaCheckCircle className="text-green-500 shrink-0"/>
                                         <span className="font-bold text-white text-[18px]">{Math.floor(dataset.totalRecords * 0.45).toLocaleString()}</span>
                                         <span className="text-slate-300 hover:text-white cursor-pointer hover:underline decoration-slate-500 underline-offset-4">Instagram Handles</span>
                                     </div>
                                     <div className="flex items-center gap-3">
                                         <FaCheckCircle className="text-green-500 shrink-0"/>
                                         <span className="font-bold text-white text-[18px]">{Math.floor(dataset.totalRecords * 0.15).toLocaleString()}</span>
                                         <span className="text-slate-300 hover:text-white cursor-pointer hover:underline decoration-slate-500 underline-offset-4">X Handles</span>
                                     </div>
                                     <div className="flex items-center gap-3">
                                         <FaCheckCircle className="text-green-500 shrink-0"/>
                                         <span className="font-bold text-white text-[18px]">{Math.floor(dataset.totalRecords * 0.05).toLocaleString()}</span>
                                         <span className="text-slate-300 hover:text-white cursor-pointer hover:underline decoration-slate-500 underline-offset-4">TikTok Profiles</span>
                                     </div>
                                     <div className="flex items-center gap-3">
                                         <FaCheckCircle className="text-green-500 shrink-0"/>
                                         <span className="font-bold text-white text-[18px]">{Math.floor(dataset.totalRecords * 0.12).toLocaleString()}</span>
                                         <span className="text-slate-300 hover:text-white cursor-pointer hover:underline decoration-slate-500 underline-offset-4">YouTube Channels</span>
                                     </div>
                                 </div>
                            </div>

                            <p className="text-blue-400 text-xs font-semibold mb-6">
                                Data updated on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>

                            {/* PRICE & BUTTONS */}
                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                <div>
                                    <div className="flex items-end gap-3 mb-4">
                                        {(() => {
                                            const p = dataset.price || 199;
                                            const pp = dataset.previousPrice || 398;
                                            const formatPrice = (val) => String(val).startsWith('$') ? val : `$${val}`;
                                            const priceVal = String(p).replace(/[^0-9.]/g, '');
                                            const prevVal = String(pp).replace(/[^0-9.]/g, '');
                                            // Calculate discount if both are parseable numbers
                                            const discount = (priceVal && prevVal) 
                                                ? Math.round(((parseFloat(prevVal) - parseFloat(priceVal)) / parseFloat(prevVal)) * 100)
                                                : 50;
                                            
                                            return (
                                                <>
                                                    <span className="text-4xl font-extrabold text-blue-500">{formatPrice(p)}</span>
                                                    <span className="text-xl text-slate-500 line-through font-medium mb-1">{formatPrice(pp)}</span>
                                                    <span className="text-white text-xl mb-1">(Holiday Discount: {discount}% OFF)</span>
                                                </>
                                            );
                                        })()}
                                    </div>
                                    
                                    <div className="flex gap-4">
                                        <button 
                                            onClick={() => setIsModalOpen(true)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded font-bold flex items-center gap-2 transition uppercase tracking-wide cursor-pointer"
                                        >
                                            <FaDownload /> Purchase Lead List
                                        </button>
                                        <button 
                                            onClick={() => setIsSampleModalOpen(true)}
                                            className="bg-white hover:bg-slate-100 text-slate-900 px-8 py-3.5 rounded font-bold flex items-center gap-2 transition uppercase tracking-wide border border-white cursor-pointer"
                                        >
                                            <FaDownload /> Free Sample Lead List
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* RIGHT CONTENT (VIDEO) */}
                        <div className="lg:w-[40%] mt-8 lg:mt-0">
                            <div className="rounded-xl overflow-hidden shadow-2xl ">
                                {/* Simulated YouTube Embed */}
                                <img src="/images/b2b-hero.png" alt="Hero banner" />
                            </div>
                        </div>
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
                                     <th className="p-3 whitespace-nowrap">Website</th>
                                     <th className="p-3 whitespace-nowrap">Email</th>
                                     <th className="p-3 whitespace-nowrap">Phone</th>
                                     <th className="p-3 whitespace-nowrap">Rating</th>
                                     <th className="p-3 whitespace-nowrap">Reviews</th>
                                     <th className="p-3 whitespace-nowrap text-center">Action</th>
                                 </tr>
                             </thead>
                             <tbody>
                                 {dataset.sampleList.map((row, idx) => (
                                     <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                         <td className="p-3 font-medium text-slate-700">{row.name}</td>
                                         <td className="p-3 text-slate-500 flex items-center gap-1 overflow-hidden text-ellipsis max-w-[200px]"><MdLocationOn className='text-blue-500 shrink-0'/>{'Avaliable'}</td>
                                         <td className="p-3 text-slate-500">{row.city}</td>
                                         <td className="p-3 text-slate-500">{row.state}</td>
                                         <td className="p-3 text-slate-500">{row.country}</td>
                                         <td className="p-3 text-slate-500 max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap">
                                            {row.website ? (
                                                <a href="#" onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }} className="text-blue-600 hover:underline flex items-center gap-1">
                                                    <FaGlobe className="shrink-0 text-xs"/> {'Available'}
                                                </a>
                                            ) : '--'}
                                         </td>
                                         <td className="p-3 text-slate-500 flex items-center gap-1 overflow-hidden text-ellipsis max-w-[200px]"><MdEmail className="text-blue-300 shrink-0"/> {'Available'}</td>
                                         <td className="p-3 text-slate-500"><span className="flex items-center gap-1"><MdPhone className="text-green-500 shrink-0"/> {'Available'}</span></td>
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
                                 onClick={() => setIsSampleModalOpen(true)}
                                 className="bg-white border border-slate-300 text-slate-700 px-6 py-2 rounded text-sm font-bold hover:bg-slate-50 transition cursor-pointer">
                                    Request Sample
                                </button>
                             </div>
                         </div>
                     </div>
                 </div>
            </div>

            {/* --- VALUE PROPOSITION SECTION --- */}
            <div className="py-20 pb-0 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-2xl font-bold text-slate-900">How DataSellerHub Data Services Helps Businesses</h2>
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

            {/* --- COUNTRY MAP SECTION --- */}
            {dataset.stateDistribution && Object.keys(dataset.stateDistribution).length > 0 && (
                <CountryMapSection
                    category={dataset.category}
                    location={dataset.location}
                    countryCode={dataset.countryCode}
                    stateDistribution={dataset.stateDistribution}
                    totalRecords={dataset.totalRecords}
                />
            )}

            {/* --- STATS SECTION --- */}
            <div className="py-16 bg-slate-50">
                 <div className="container mx-auto px-4 border-b border-slate-200 pb-16">
                     <div className="text-center mb-12">
                         <h2 className="text-2xl font-bold">How many List of {dataset.category} are there in the {dataset.location}?</h2>
                         <p className="text-slate-500 mt-2">There are a total of {dataset.totalRecords} {dataset.category} stores in {dataset.location} as of {dataset.lastUpdate}.</p>
                         
                         <div className="mt-8 flex justify-center gap-4">
                             <button className="bg-blue-600 text-white px-6 py-2 rounded font-bold text-sm">Buy Full Dataset</button>
                             <button className="bg-slate-800 text-white px-6 py-2 rounded font-bold text-sm flex items-center gap-2" onClick={() => setIsSampleModalOpen(true)}><FaDownload/> Download Sample</button>
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
                         <div className="flex-1 bg-linear-to-br from-blue-500 to-blue-700 rounded-xl p-6 text-white relative overflow-hidden">
                             <div className="relative z-10">
                                 <h4 className="font-bold mb-1">Store Owner</h4>
                                 <p className="text-sm opacity-80">Available</p>
                             </div>
                             <FaUser className="absolute bottom-4 right-4 text-6xl opacity-20" />
                         </div>
                          <div className="flex-1 bg-linear-to-br from-blue-500 to-blue-700 rounded-xl p-6 text-white relative overflow-hidden">
                             <div className="relative z-10">
                                 <h4 className="font-bold mb-1">Facility Owner</h4>
                                 <p className="text-sm opacity-80">Available</p>
                             </div>
                             <FaBuilding className="absolute bottom-4 right-4 text-6xl opacity-20" />
                         </div>
                     </div>
                 </div>

                 {/* Unlock Monthly Insights */}
                 <div className="container mx-auto px-4 py-16 pb-0 text-center">
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
            <div className="bg-blue-50/50 py-16 pt-0">
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
            <div>
                <WhyChoose />
            </div>

            {/* --- DYNAMIC FAQ SECTION --- */}
            <DatasetFaq dataset={dataset} />
            
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
                                disabled={purchaseLoading}
                                className="w-full mt-6 bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition shadow-xl shadow-slate-900/20 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {purchaseLoading ? (
                                    <span>Processing...</span>
                                ) : (
                                    <>
                                    <div className="w-8 h-8 bg-slate-700/50 rounded flex items-center justify-center group-hover:bg-slate-700 transition">
                                        <FaShoppingCart className="text-sm" />
                                    </div>
                                    BUY NOW
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- SAMPLE REQUEST MODAL --- */}
            {isSampleModalOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
                        {/* Close button */}
                        <button 
                            onClick={() => setIsSampleModalOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
                        >
                            <FaTimes className="text-xl" />
                        </button>

                        {/* Logo */}
                        <div className="flex justify-center mb-6">
                            <div className="flex items-center gap-2 text-slate-900 font-bold text-2xl">
                                <img src="/images/logo.jpg" alt="logo" className='w-10 ' />
                                Data Scraper Hub
                            </div>
                        </div>

                        {/* Title */}
                        <div className="text-center mb-8">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                Free sample lead list of <span className="text-blue-600">{dataset.category}</span> in <span className="text-blue-600">{dataset.location}</span>
                            </h3>
                            <p className="text-slate-500 text-sm">Fill in the below details</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSampleDownload} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    required
                                    value={sampleForm.fullName}
                                    onChange={handleSampleChange}
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
                                    value={sampleForm.email}
                                    onChange={handleSampleChange}
                                    placeholder="Email Address"
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
                                        value={sampleForm.phoneNumber}
                                        onChange={handleSampleChange}
                                        placeholder="Phone Number"
                                        className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={purchaseLoading}
                                className="w-full mt-6 bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition shadow-xl shadow-slate-900/20 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {purchaseLoading ? (
                                    <span>Processing...</span>
                                ) : (
                                    <>
                                    <div className="w-8 h-8 bg-slate-700/50 rounded flex items-center justify-center group-hover:bg-slate-700 transition">
                                        <FaDownload className="text-sm" />
                                    </div>
                                    DOWNLOAD SAMPLE
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default B2bDatasetDetail;
