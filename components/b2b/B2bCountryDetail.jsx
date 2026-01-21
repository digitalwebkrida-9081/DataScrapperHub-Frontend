'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaGlobe, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const B2bCountryDetail = ({ countrySlug }) => {
    const [countryName, setCountryName] = useState('');
    const [states, setStates] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAllStates, setShowAllStates] = useState(false);

    // Initial Data Fetching
    useEffect(() => {
        const fetchData = async () => {
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
                // Note: The backend API requires the exact country name for fetching states
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

    // Capitalize for display
    const displayName = countryName.replace(/\b\w/g, l => l.toUpperCase());

    return (
        <div className="bg-white min-h-screen font-sans text-slate-800">
            {/* HERO like B2B Page but simpler */}
            <div className="relative bg-[#030e21] text-white pt-16 pb-20 overflow-hidden">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="text-blue-400">{displayName}</span> Business Data
                    </h1>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                        Explore verified B2B leads and business contacts across states and industries in {displayName}.
                    </p>
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
                                    <Link 
                                        key={idx} 
                                        href={`/b2b?country=${encodeURIComponent(displayName)}&state=${encodeURIComponent(state.name)}`}
                                        className="flex items-center gap-2 p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition group"
                                    >
                                        <span className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-blue-500 transition-colors"></span>
                                        <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700 truncate">{state.name}</span>
                                    </Link>
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
