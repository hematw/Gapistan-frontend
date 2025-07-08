import React, { useEffect, useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import axiosIns from "../utils/axios";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";

const PAGE_SIZE = 10;

const DashboardReports = () => {
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [resolvingId, setResolvingId] = useState(null);

  // Add this handler
  const handleDelete = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      await axiosIns.delete(`/reports/${reportId}`);
      setReports((prev) => prev.filter((r) => r._id !== reportId));
    } catch (err) {
      addToast({
        color: "danger",
        message: err.response?.data?.message || "Failed to delete report",
      });
    }
  };

  const fetchReports = async (page, search) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosIns.get(
        `/reports?page=${page}&limit=${PAGE_SIZE}${
          search ? `&search=${encodeURIComponent(search)}` : ""
        }`
      );
      setReports(data.reports || []);
      setTotalPages(Math.ceil((data.total || 0) / PAGE_SIZE) || 1);
    } catch (err) {
      setError(err.message || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(page, search);
    // eslint-disable-next-line
  }, [page, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleResolve = async (reportId) => {
    setResolvingId(reportId);
    try {
      await axiosIns.patch(`/reports/${reportId}/status`, {
        status: "resolved",
      });
      setReports((prev) =>
        prev.map((r) => (r._id === reportId ? { ...r, status: "resolved" } : r))
      );
    } catch (err) {
      addToast({
        color: "danger",
        message: err.response?.data?.message || "Failed to resolve report",
      });
    }
  };

  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      <div className="reports-content p-8 flex-1 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Reports</h1>
        <form onSubmit={handleSearch} className="mb-4 flex gap-2 items-center">
          <Input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search reports..."
            className="border rounded px-3 py-2 w-64"
          />
          <Button type="submit" radius="sm">
            Search
          </Button>
        </form>
        {loading ? (
          <p>Loading reports...</p>
        ) : error ? (
          <p className="text-red-500">Error loading reports: {error}</p>
        ) : reports.length === 0 ? (
          <p>No reports found.</p>
        ) : (
          <>
            <ul className="space-y-2">
              {reports.map((report) => (
                <li
                  key={report._id}
                  className="bg-white dark:bg-dark rounded-2xl shadow-md p-6 space-y-4 border border-gray-100 dark:border-neutral-800"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                        Report by @{report.reporter?.username}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">
                        {report.reporter?.email}
                      </p>
                    </div>
                    <div className="text-sm text-gray-400 dark:text-neutral-500">
                      {new Date(report.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Reported User:
                      </span>{" "}
                      @{report.reportedUser?.username} (
                      {report.reportedUser?.email})
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Reason:
                      </span>{" "}
                      {report.reason}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Status:
                      </span>{" "}
                      <span
                        className={`capitalize px-2 py-0.5 text-sm rounded-full ${
                          report.status === "resolved"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                        }`}
                      >
                        {report.status}
                      </span>
                      <div className="ml-auto flex gap-2">
                        <Button
                          radius="sm"
                          size="sm"
                          color="danger"
                          disabled={resolvingId === report._id}
                          onPress={() => handleDelete(report._id)}
                        >
                          Delete (Reject)
                        </Button>
                        {report.status !== "resolved" && (
                          <Button
                            radius="sm"
                            size="sm"
                            color="success"
                            disabled={resolvingId === report._id}
                            onPress={() => handleResolve(report._id)}
                          >
                            {resolvingId === report._id
                              ? "Resolving..."
                              : "Resolve (Ban User)"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex justify-between items-center mt-4">
              <Button
                radius="sm"
                disabled={page === 1}
                onPress={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span>
                Page {page} of {totalPages}
              </span>
              <Button
                radius="sm"
                disabled={page === totalPages}
                onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardReports;
