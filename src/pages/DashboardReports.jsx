import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axiosIns from "../utils/axios";

const DashboardReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axiosIns.get("/reports");
        setReports(data.reports || []);
      } catch (err) {
        setError(err.message || "Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, []);

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="reports-content p-8 flex-1">
        <h1 className="text-2xl font-bold mb-6">Reports</h1>
        {loading ? (
          <p>Loading reports...</p>
        ) : error ? (
          <p className="text-red-500">Error loading reports: {error}</p>
        ) : reports.length === 0 ? (
          <p>No reports found.</p>
        ) : (
          <ul className="space-y-2">
            {reports.map((report) => (
              <li key={report.id || report._id} className="bg-white dark:bg-dark rounded shadow p-4">
                <span className="font-semibold">{report.title || report.subject}</span>
                {report.description && (
                  <p className="text-gray-600 mt-1">{report.description}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DashboardReports;
