import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axiosIns from "../utils/axios";

const PAGE_SIZE = 10;

const DashboardUsers = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [banning, setBanning] = useState({});

  const fetchUsers = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosIns.get(`/users?page=${page}&limit=${PAGE_SIZE}`);
      setUsers(data.users);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const handleBan = async (userId) => {
    setBanning((prev) => ({ ...prev, [userId]: true }));
    try {
      await axiosIns.post(`/users/${userId}/ban`);
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, banned: true } : u)));
    } catch (err) {
        console.error(err)
      alert("Failed to ban user");
    } finally {
      setBanning((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="users-content p-8 flex-1">
        <h1 className="text-2xl font-bold mb-6">Users</h1>
        {loading ? (
          <p>Loading users...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-dark rounded-lg shadow">
              <thead>
                <tr>
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Email</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b">
                    <td className="py-2 px-4">{user.name || user.username}</td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">
                      {user.banned ? (
                        <span className="text-red-500 font-semibold">Banned</span>
                      ) : (
                        <span className="text-green-600">Active</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
                        disabled={user.banned || banning[user._id]}
                        onClick={() => handleBan(user._id)}
                      >
                        {banning[user._id] ? "Banning..." : user.banned ? "Banned" : "Ban"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardUsers;
