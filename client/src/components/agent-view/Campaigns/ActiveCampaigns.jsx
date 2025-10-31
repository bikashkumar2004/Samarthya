// pages/CampaignsPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCampaigns } from "@/store/campaign";
import CampaignsCard from "./CampaignsCard";


export default function CampaignsPage() {
  const dispatch = useDispatch();
  const { campaigns, isLoading, error } = useSelector((s) => s.campaigns);

  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [q, setQ] = useState("");

  const load = () => {
    dispatch(
      fetchAllCampaigns({
        status: status || undefined,
        type: type || undefined,
        category: category || undefined,
        q: q?.trim() || undefined,
      })
    );
  };

  useEffect(() => {
    load();
  }, []); 

  return (
    <div className="p-4 space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="running">Running</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Types</option>
          <option value="message">Message</option>
          <option value="call">Call</option>
        </select>

        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category (exact)"
          className="border p-2 rounded"
        />

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name/code"
          className="border p-2 rounded"
        />

        <button onClick={load} className="bg-emerald-600 text-white rounded px-4">
          Apply
        </button>
      </div>

      {isLoading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error.message || "Failed"}</div>}
      <CampaignsCard campaigns={campaigns || []}/>
    </div>
  );
}
