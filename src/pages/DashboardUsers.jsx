import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axiosIns from "../utils/axios";
import DashboardSidebar from "../components/DashboardSidebar";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

const PAGE_SIZE = 10;

const DashboardUsers = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [banning, setBanning] = useState({});
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const fetchUsers = async (page, search) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosIns.get(
        `/users?page=${page}&limit=${PAGE_SIZE}${search ? `&search=${encodeURIComponent(search)}` : ""}`
      );
      setUsers(data.users);
      setTotalPages(Math.ceil(data.total / PAGE_SIZE) || 1);
    } catch (err) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, search);
  }, [page, search]);

  const handleBan = async (userId) => {
    setBanning((prev) => ({ ...prev, [userId]: true }));
    try {
      await axiosIns.patch(`/users/${userId}/ban`);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isBanned: true } : u))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to ban user");
    } finally {
      setBanning((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      <div className="users-content p-8 flex-1 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Users</h1>
        <form onSubmit={handleSearchSubmit} className="mb-4 flex gap-2 items-center">
          <Input
            type="text"
            placeholder="Search users..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="border px-3 py-2 rounded w-64"
          />
          <Button type="submit" radius="sm">
            Search
          </Button>
        </form>
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
                      {user.isBanned ? (
                        <span className="text-red-500 font-semibold">
                          Banned
                        </span>
                      ) : (
                        <span className="text-green-600">Active</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      <Button
                        color="danger"
                        disabled={user.banned || banning[user._id]}
                        onPress={() => handleBan(user._id)}
                      >
                        {banning[user._id]
                          ? "Banning..."
                          : user.banned
                          ? "Banned"
                          : "Ban"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardUsers;
