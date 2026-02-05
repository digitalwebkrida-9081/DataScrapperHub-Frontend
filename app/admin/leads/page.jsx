'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLeadsPage() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Client-Side Auth Check
        const isAuth = localStorage.getItem('admin_auth');
        if (!isAuth) {
            router.push('/admin/login');
        } else {
            fetchLeads();
        }
    }, []);

    const fetchLeads = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
            const res = await fetch(`${API_URL}/api/forms/all`);
            const data = await res.json();
            if (data.success) {
                setLeads(data.data);
            }
        } catch (error) {
            console.error("Error fetching leads:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading leads...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-8 mt-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard - Leads</h1>
                    <button 
                        onClick={fetchLeads} 
                        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition cursor-pointer"
                    >
                        Refresh Data
                    </button>
                </header>

                <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-100 text-xs uppercase font-bold text-slate-700">
                                <tr>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Email / Phone</th>
                                    <th className="px-6 py-4">Message / Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {leads.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-slate-400">No leads found.</td>
                                    </tr>
                                ) : (
                                    leads.map((lead) => (
                                        <tr key={lead._id} className="hover:bg-slate-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {new Date(lead.createdAt).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    lead.type === 'custom_database' ? 'bg-purple-100 text-purple-700' :
                                                    lead.type === 'sample_request' ? 'bg-green-100 text-green-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {lead.type.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                {lead.name || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span>{lead.email}</span>
                                                    {lead.phone && <span className="text-xs text-slate-400">{lead.phone}</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 max-w-xs truncate">
                                                {lead.message && (
                                                    <div className="mb-1" title={lead.message}>
                                                        <span className="font-semibold text-xs">Msg:</span> {lead.message}
                                                    </div>
                                                )}
                                                {lead.datasetDetails && (
                                                    <div className="text-xs text-slate-500 bg-slate-100 p-1 rounded">
                                                        Dataset: {lead.datasetDetails.name} <br/>
                                                        Cat: {lead.datasetDetails.category}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
