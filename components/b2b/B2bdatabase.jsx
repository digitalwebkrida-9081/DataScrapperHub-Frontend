'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaSearch, FaFilter, FaCheckCircle, FaGlobe, FaDatabase, FaEnvelope, FaPhone, FaArrowRight, FaChartLine, FaUserFriends, FaBuilding, FaStar } from 'react-icons/fa';
import { MdEmail, MdPhone, MdKeyboardArrowRight, MdKeyboardArrowDown } from 'react-icons/md';
import SearchableDropdown from '../ui/SearchableDropdown';

const B2bdatabase = ({ isSeoPage = false, initialFilters = {} }) => {
    // State for data and loading
    // State for data and loading
    const [datasets, setDatasets] = useState([]);
    const [loading, setLoading] = useState(true);

    // Dropdown options
    const [categories, setCategories] = useState([]);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    // Filter states
    const [filters, setFilters] = useState({
        category: initialFilters.category || 'Restaurants',
        country: initialFilters.country || 'United States',
        state: initialFilters.state || 'New York',
        city: initialFilters.city || 'New York'
    });

    // Helper functions for fetching dropdown data
    const fetchCategories = async () => {
        try {
            const catRes = await fetch('http://localhost:5000/api/category');
            const catData = await catRes.json();
            setCategories(catData.data || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchCountries = async () => {
        try {
            const countryRes = await fetch('http://localhost:5000/api/country/get-countries');
            const countryData = await countryRes.json();
            setCountries(countryData.data || []);
        } catch (error) {
            console.error("Error fetching countries:", error);
        }
    };

    const fetchStates = async () => {
        if (!filters.country) {
            setStates([]);
            return;
        }
        try {
            // Backend is currently hardcoded for US states/cities
            const response = await fetch(`http://localhost:5000/api/location/states?country=${encodeURIComponent(filters.country)}`);
            const result = await response.json();
            setStates(result.data || []);
        } catch (error) {
            console.error("Error fetching states:", error);
        }
    };

    // Initial data fetching on mount
    useEffect(() => {
        const initializePage = async () => {
            setLoading(true);
            // Fetch essentials
            await Promise.all([fetchCategories(), fetchCountries()]);
            
            // If not SEO page, trigger the default search (for United States)
            if (!isSeoPage) {
                handleSearch();
            } else {
                setLoading(false);
            }
        };

        initializePage();
    }, []);

    // Fetch states when country changes
    useEffect(() => {
        if (filters.country && countries.length > 0) {
            fetchStates();
        }
    }, [filters.country, countries]);

    // Fetch Cities when State changes
    useEffect(() => {
        const fetchCities = async () => {
            if (!filters.state) {
                setCities([]);
                return;
            }
            try {
                const stateObj = states.find(s => s.name === filters.state);
                if (!stateObj) return;

                const response = await fetch(`http://localhost:5000/api/location/cities/${stateObj.isoCode}?country=${encodeURIComponent(filters.country)}`);
                const result = await response.json();
                setCities(result.data || []);
            } catch (error) {
                console.error("Error fetching cities:", error);
            }
        };

        if (filters.state) fetchCities();
    }, [filters.state, states]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'country' ? { state: '', city: '' } : {}),
            ...(name === 'state' ? { city: '' } : {})
        }));
    };

    const handleSearch = async () => {
        const { category, country, state, city } = filters;
        
        if (!category) {
             alert("Please select at least a category.");
             return;
        }

        setLoading(true);

        try {
            // New logic: Fetch "Dataset Summary" instead of raw business list
            const queryParams = new URLSearchParams({
                country: country || '',
                state: state || '',
                city: city || '',
                category: category
            });

            const response = await fetch(`http://localhost:5000/api/scraper/dataset/search?${queryParams}`);
            const result = await response.json();
            
            if (result.success && result.dataset) {
                // If dataset found, show it as a single row in the table
                // We adapt the dataset object to match the table rendering usage temporarily
                // Or we update the table columns. 
                // Let's map it to match existing table columns to minimize UI rewrite, but change semantics.
                const ds = result.dataset;
                const mappedData = [{
                    id: ds.id,
                    name: `List Of ${ds.category} in ${ds.location}`,
                    records: ds.totalRecords.toLocaleString(), // Showing counts
                    emails: ds.emailCount.toLocaleString(), 
                    phones: ds.phones.toLocaleString(),
                    full_address: `Last Updated: ${ds.lastUpdate}`, // Using address slot for sub-info
                    price: ds.price,
                    isDataset: true
                }];
                setDatasets(mappedData);
            } else {
                setDatasets([]);
            }

        } catch (error) {
            console.error("Error searching data:", error);
            setDatasets([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white min-h-screen font-sans text-slate-800">
            {/* ... (Hero Section remains same) ... */}
            <div className="relative bg-[#0a1f44] text-white pt-20 pb-24 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                     <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#4F46E5" d="M42.7,-62.9C50.9,-52.8,50.1,-34.4,51.7,-19.2C53.4,-4,57.4,8,54,18.7C50.6,29.4,39.8,38.8,28.5,45.6C17.2,52.4,5.4,56.6,-7.1,58.8C-19.6,61,-32.8,61.2,-43.3,54.7C-53.8,48.2,-61.6,35,-65.4,20.9C-69.2,6.8,-69,-8.2,-63.3,-21.3C-57.6,-34.4,-46.4,-45.6,-34.8,-53.9C-23.2,-62.2,-11.6,-67.6,2.2,-71C16,-74.4,32,-75.8,42.7,-62.9Z" transform="translate(100 100)" />
                    </svg>
                </div>

                <div className="container mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center justify-between">
                    <div className="lg:w-1/2 mb-10 lg:mb-0">
                        <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
                            Discover authentic, sales-<br />
                            qualified <span className="text-blue-400">B2B leads</span>
                        </h1>
                        <p className="text-slate-300 text-lg mb-8 max-w-lg">
                            Access millions of businesses with verified emails, phone numbers, and key decision-maker data.
                        </p>
                    </div>
                    
                    <div className="lg:w-1/2 flex justify-center">
                        <div className="p-2 rounded-xl ">
                             <img 
                                src="images/b2b-hero.png" 
                                alt="Dashboard Preview" 
                                className="rounded-lg shadow-lg max-w-full h-auto"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MAIN SEARCH & DATA SECTION --- */}
            <div className="bg-slate-50 py-16">
                <div className="container mx-auto px-4">
                    {!isSeoPage && (
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-slate-900">Search Our B2B Datasets</h2>
                        </div>
                    )}

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* SIDEBAR FILTERS (unchanged logic, just rendering) */}
                        <div className="lg:w-1/4">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                    <FaFilter className="text-blue-600" /> Filters
                                </h3>
                                
                                <div className="space-y-4">
                                    {/* Category Select */}
                                    <div className="relative">
                                        <SearchableDropdown
                                            label="Category"
                                            name="category"
                                            value={filters.category}
                                            onChange={handleFilterChange}
                                            options={categories.map(c => c.name)}
                                            placeholder="Select Category"
                                        />
                                    </div>

                                    {/* Country Select */}
                                    <div className="relative">
                                        <SearchableDropdown
                                            label="Country"
                                            name="country"
                                            value={filters.country}
                                            onChange={handleFilterChange}
                                            options={countries.map(c => c.country_name || c.name)}
                                            placeholder="Select Country"
                                        />
                                    </div>

                                    {/* State Select */}
                                    <div className="relative">
                                        <SearchableDropdown
                                            label="State"
                                            name="state"
                                            value={filters.state}
                                            onChange={handleFilterChange}
                                            options={states.map(s => s.name)}
                                            placeholder="Select State"
                                            disabled={!filters.country}
                                        />
                                    </div>

                                    {/* City Select */}
                                    <div className="relative">
                                        <SearchableDropdown
                                            label="City"
                                            name="city"
                                            value={filters.city}
                                            onChange={handleFilterChange}
                                            options={cities.map(c => c.name)}
                                            placeholder="Select City"
                                            disabled={!filters.state}
                                        />
                                    </div>
                                    
                                    <button 
                                        onClick={handleSearch}
                                        className="w-full mt-4 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 cursor-pointer"
                                    >
                                        SEARCH CUSTOM LEADS
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* DATA TABLE */}
                        <div className="lg:w-3/4">
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                {loading ? (
                                    <div className="p-12 text-center text-slate-500">
                                         <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600 mb-2"></div>
                                         <p>Finding the comprehensive dataset...</p>
                                    </div>
                                ) : datasets.length === 0 ? (
                                    <div className="p-12 text-center text-slate-500">
                                        <p>No complete datasets found for this criteria.</p>
                                        <Link href="/maps-scraper" className="text-blue-600 hover:underline mt-2 inline-block">
                                            Need this data? Use our Scraper to compile it first.
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-blue-50 text-blue-900 text-xs uppercase font-bold tracking-wider">
                                                    <th className="p-4 border-b border-blue-100">Name</th>
                                                    <th className="p-4 border-b border-blue-100">Number of Records</th>
                                                    <th className="p-4 border-b border-blue-100 flex items-center gap-1"><MdEmail/> Emails</th>
                                                    <th className="p-4 border-b border-blue-100"><span className="flex items-center gap-1"><MdPhone/> Phones</span></th>
                                                    <th className="p-4 border-b border-blue-100 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {datasets.map((item) => (
                                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                                        <td className="p-4 font-medium text-slate-700">
                                                            <div className="font-bold text-lg text-slate-700">{item.name}</div>
                                                            <div className="text-xs text-slate-400 mt-1">{item.full_address}</div>
                                                        </td>
                                                        <td className="p-4 text-slate-600 font-bold">{item.records}</td>
                                                        <td className="p-4 text-slate-600">{item.emails}</td>
                                                        <td className="p-4 text-slate-600">{item.phones}</td>
                                                        <td className="p-4">
                                                            <div className="flex gap-2 justify-end">
                                                                <Link href={`/b2b/${item.id}`} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow hover:bg-blue-700 transition">
                                                                    View & Purchase Report
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                
                                <div className="p-4 border-t border-slate-100 flex justify-center">
                                    {/* Pagination or load more if mostly needed for many datasets */}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BADGES SECTION */}
                    <div className="mt-20 flex justify-center gap-8 flex-wrap">
                        <img src="images/mid-image.png" alt="Badges" />
                    </div>
                </div>
            </div>

            {/* --- LISTS SECTION --- */}
            <div className="bg-white py-16">
                <div className="container mx-auto px-4">
                    
                    {/* Continents */}
                    <div className="mb-16">
                        <h3 className="text-2xl font-bold text-center mb-8">
                            {filters.country 
                                ? `Business leads by State in ${filters.country}` 
                                : 'Business Leads By Continents'}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm max-w-4xl mx-auto">
                            {['North America', 'South America', 'Europe', 'Asia', 'Africa', 'Oceania'].map(c => (
                                <a key={c} href="#" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition">
                                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                                    Business Leads in {c}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Domains */}
                     <div>
                        <h3 className="text-2xl font-bold text-center mb-8">
                            Find <span className="text-blue-600">B2B Leads</span> Across {filters.country ? `${filters.country} Different Domains` : 'Different Domains'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-8 text-xs text-slate-500 max-w-6xl mx-auto">
                            {/* Generating a long list of domains using all actual countries */}
                            {countries.length > 0 ? (
                                countries.map((country, i) => {
                                    const randomNum = Math.floor(1000 + Math.random() * 9000);
                                    const countryName = country.country_name || country.name;
                                    const slug = countryName.toLowerCase().replace(/\s+/g, '-');
                                    const label = `Business Leads in ${countryName} (${randomNum})`;
                                    return (
                                        <Link key={i} href={`/b2b/c/${slug}`} className="flex items-start gap-2 text-slate-500 hover:text-blue-600 transition">
                                            <span className="mt-1.5 w-1 h-1 bg-slate-400 rounded-full shrink-0"></span>
                                            <span>{label}</span>
                                        </Link>
                                    );
                                })
                            ) : (
                                [...Array(24)].map((_, i) => (
                                    <div key={i} className="flex items-start gap-2 text-slate-300">
                                        <span className="mt-1.5 w-1 h-1 bg-slate-200 rounded-full shrink-0"></span>
                                        <div className="h-3 w-32 bg-slate-100 rounded animate-pulse"></div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- STATS / BEYOND LEADS --- */}
            <div className="bg-slate-50 py-16">
                 <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                         <h3 className="text-2xl font-bold mb-4">Beyond Just Leads</h3>
                         <p className="text-slate-500 max-w-2xl mx-auto">
                             We optimize your outreach with data that drives conversion. Accurate, verified, and ready for your CRM.
                         </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        <div className="bg-blue-600 text-white p-8 rounded-xl relative overflow-hidden group">
                           <div className="relative z-10">
                                <h4 className="text-lg font-medium opacity-90 mb-2">Close Faster</h4>
                                <div className="text-5xl font-bold mb-2">62%</div>
                                <p className="text-xs opacity-75">Increase in sales velocity</p>
                           </div>
                           <FaChartLine className="absolute bottom-4 right-4 text-blue-500 text-8xl opacity-30 group-hover:scale-110 transition-transform" />
                        </div>
                         <div className="bg-blue-600 text-white p-8 rounded-xl relative overflow-hidden group">
                           <div className="relative z-10">
                                <h4 className="text-lg font-medium opacity-90 mb-2">Save Budgets</h4>
                                <div className="text-5xl font-bold mb-2">3x</div>
                                <p className="text-xs opacity-75">Return on investment</p>
                           </div>
                           <FaDatabase className="absolute bottom-4 right-4 text-blue-500 text-8xl opacity-30 group-hover:scale-110 transition-transform" />
                        </div>
                         <div className="bg-blue-600 text-white p-8 rounded-xl relative overflow-hidden group">
                           <div className="relative z-10">
                                <h4 className="text-lg font-medium opacity-90 mb-2">Attract Customers</h4>
                                <div className="text-5xl font-bold mb-2">74%</div>
                                <p className="text-xs opacity-75">More quality leads generated</p>
                           </div>
                           <FaUserFriends className="absolute bottom-4 right-4 text-blue-500 text-8xl opacity-30 group-hover:scale-110 transition-transform" />
                        </div>
                    </div>
                 </div>
            </div>

            {/* --- CTA SECTION --- */}
            <div className="bg-white py-20 border-b border-slate-100">
                <div className="container mx-auto px-4">
                    <div className="bg-slate-100 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="md:w-2/3">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">
                                Harness the Power of <span className="text-blue-600">DataScraperHub</span>
                            </h2>
                            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                                Our web scraping services collect data and convert it into standardized CSV, Excel, and JSON formats. We deliver accurate, fast data scraping to meet the high-volume needs of enterprises. These samples illustrate the breadth of our web scraping capabilities across industries. We can extract data for any business sector.
                            </p>
                            <button className="bg-blue-600 text-white px-8 py-3.5 rounded-lg font-semibold shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition flex items-center gap-2 cursor-pointer">
                                <Link href="/contact">Contact Our Experts Now </Link>
                            </button>
                        </div>
                        <div className="md:w-1/3 flex justify-center">
                            {/* Illustration placeholder */}
                            <div className="relative">
                                <img src="images/vector/team-illustration.png" alt="team-illustration" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default B2bdatabase;
