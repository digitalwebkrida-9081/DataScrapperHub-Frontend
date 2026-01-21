'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaGlobe, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const B2bCountryDetail = ({ countrySlug }) => {
    const router = useRouter();
    const [countryName, setCountryName] = useState('');
    const [states, setStates] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAllStates, setShowAllStates] = useState(false);
    const [checkingState, setCheckingState] = useState(null); // Track which state is being checked

    // Initial Data Fetching
    useEffect(() => {
        const fetchData = async () => {
             // ... existing fetch logic ...
             setLoading(true);
            try {
                // 1. Get Country Name from Slug
                setCountryName(decodeURIComponent(countrySlug).replace(/-/g, ' '));
                const formattedCountryName = decodeURIComponent(countrySlug).replace(/-/g, ' ');

                // 2. Fetch Categories
                const catRes = await fetch('http://localhost:5000/api/category');
                const catResult = await catRes.json();
                if (catResult.success) setCategories(catResult.data || []);

                // 3. Fetch States for this Country
                const statesRes = await fetch(`http://localhost:5000/api/location/states?country=${encodeURIComponent(formattedCountryName)}`);
                const statesResult = await statesRes.json();
                if (statesResult.success) setStates(statesResult.data || []);

            } catch (error) {
                console.error("Error loading country details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (countrySlug) {
            fetchData();
        }
    }, [countrySlug]);

    // Handle State Click
    const handleStateClick = async (stateName) => {
        setCheckingState(stateName);
        try {
            // Check if there is data for this state
            const response = await fetch(`http://localhost:5000/api/scraper/dataset/search?country=${encodeURIComponent(countryName)}&state=${encodeURIComponent(stateName)}`);
            const result = await response.json();

            if (result.success && result.datasets && result.datasets.length > 0) {
                // Found specific data, go to the first dataset (most relevant)
                const datasetId = result.datasets[0].id;
                const label = result.datasets[0].location || `${stateName}, ${countryName}`;
                router.push(`/b2b/${datasetId}?label=${encodeURIComponent(label)}`);
            } else {
                // No specific dataset found, fall back to general search
                router.push(`/b2b?country=${encodeURIComponent(countryName)}&state=${encodeURIComponent(stateName)}`);
            }
        } catch (error) {
            console.error("Error checking state data:", error);
            // Fallback on error
            router.push(`/b2b?country=${encodeURIComponent(countryName)}&state=${encodeURIComponent(stateName)}`);
        } finally {
            setCheckingState(null);
        }
    };

    // Capitalize for display
    const displayName = countryName.replace(/\b\w/g, l => l.toUpperCase());

    return (
        <div className="bg-white min-h-screen font-sans text-slate-800">
            {/* HERO SECTION */}
            <div className="relative bg-[#030e21] text-white pt-16 pb-20 overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        {/* LEFT CONTENT */}
                        <div className="lg:w-1/2 text-center lg:text-left">
                            <div className="text-xs font-semibold text-blue-400 mb-4 tracking-wider uppercase">
                                <Link href="/" className="hover:text-blue-300 transition">Home</Link> / <Link href="/b2b" className="hover:text-blue-300 transition">B2B Database</Link> / {displayName}
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400">
                                    {displayName}
                                </span> <br className="hidden lg:block"/> Business Reports
                            </h1>
                            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                Access comprehensive B2B leads, verified company data, and market insights for {displayName}. 
                                Drill down by state or explore top industry categories to fuel your growth.
                            </p>
                            
                            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                                    <FaGlobe className="text-blue-400" />
                                    <span className="text-sm font-medium">{states.length} States Covered</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                                    <FaChevronDown className="text-emerald-400" />
                                    <span className="text-sm font-medium">{categories.length}+ Industries</span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT CONTENT (Vector/Image) */}
                        <div className="lg:w-1/2 flex justify-center lg:justify-end relative">
                            {/* Decorative blobs */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
                            <div className="absolute bottom-0 left-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl -z-10"></div>
                            
                            <img 
                                src="/images/vector/data-delivery-image-1.png" 
                                alt={`${displayName} Business Data`} 
                                className="max-w-full h-auto drop-shadow-2xl animate-in slide-in-from-right duration-700"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* --- SECTION 1: STATES (Collapsible) --- */}
                <div className="mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-slate-900">
                        Business Leads by State in <span className="text-blue-600">{displayName}</span>
                    </h2>

                    {loading ? (
                        <div className="text-center py-8">Loading states...</div>
                    ) : states.length > 0 ? (
                        <div className="max-w-5xl mx-auto">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {(showAllStates ? states : states.slice(0, 12)).map((state, idx) => (
                                    <div 
                                        key={idx} 
                                        onClick={() => handleStateClick(state.name)}
                                        className={`flex items-center gap-2 p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition group cursor-pointer ${checkingState === state.name ? 'opacity-70 pointer-events-none' : ''}`}
                                    >
                                        {checkingState === state.name ? (
                                            <div className="w-2 h-2 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
                                        ) : (
                                            <span className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-blue-500 transition-colors"></span>
                                        )}
                                        <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700 truncate">{state.name}</span>
                                    </div>
                                ))}
                            </div>

                            {states.length > 12 && (
                                <div className="text-center mt-8">
                                    <button 
                                        onClick={() => setShowAllStates(!showAllStates)}
                                        className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline"
                                    >
                                        {showAllStates ? (
                                            <>Show Less <FaChevronUp /></>
                                        ) : (
                                            <>Show All {states.length} States <FaChevronDown /></>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                         <div className="text-center text-slate-500 italic">No state data available for this country.</div>
                    )}
                </div>

                {/* --- SECTION 2: DOMAINS (Categories) --- */}
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-slate-900">
                        Find B2B Leads In <span className="text-blue-600">{displayName}</span> Across Different Domains
                    </h2>

                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-8">
                        {categories.map((cat, idx) => {
                             // Random number simulation for "social proof" feel, or could use real counts if available
                            const randomNum = Math.floor(Math.random() * 5000) + 1000; 
                            return (
                                <Link 
                                    key={idx}
                                    href={`/b2b?country=${encodeURIComponent(displayName)}&category=${encodeURIComponent(cat.name)}`}
                                    className="flex items-start gap-2 text-slate-500 hover:text-blue-600 transition group text-[14px]"
                                >
                                    <span className="mt-1.5 w-1.5 h-1.5 bg-slate-400 group-hover:bg-blue-500 rounded-full shrink-0"></span>
                                    <span className="font-medium">
                                        {cat.name} Leads in {displayName}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default B2bCountryDetail;
