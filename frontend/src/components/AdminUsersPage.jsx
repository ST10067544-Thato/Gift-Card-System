import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { RefreshCw, Key, XCircle, CheckCircle, Eye, EyeOff, Plus } from "lucide-react";

const AdminUsersPage = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [isNewUserPasswordVisible, setIsNewUserPasswordVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [newUserRole, setNewUserRole] = useState("store");

  const itemsPerPage = 6;
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = sessionStorage.getItem("authToken");
        const role = sessionStorage.getItem("userRole");

        if (!token || role !== "admin") {
          throw new Error("Unauthorized");
        }

        const response = await axios.get(`${API_BASE_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        if (error.response?.status === 403) {
          sessionStorage.clear();
          window.location.href = "/login";
        } else {
          setError("Failed to fetch users. Please try again.");
          console.error("Error fetching users:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [API_BASE_URL]);

  // Handle revoke 2FA
  const handleRevoke2FA = async (email) => {
    try {
      const token = sessionStorage.getItem("authToken");
      const role = sessionStorage.getItem("userRole");

      if (!token || role !== "admin") {
        setError("Unauthorized. Please log in as an admin.");
        return;
      }

      await axios.post(
        `${API_BASE_URL}/admin/revoke-2fa`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.email === email ? { ...user, has2FA: false } : user
        )
      );
      setIsRevokeModalOpen(false);
      setSuccessMessage("2FA revoked successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setError(error.response?.status === 403 ? "Access denied. Please check your permissions." : "Failed to revoke 2FA. Please try again.");
      console.error("Error revoking 2FA:", error.response?.data || error.message);
    }
  };

  // Handle change password
  const handleChangePassword = async () => {
    if (!selectedUser || !newPassword) return;

    try {
      const token = sessionStorage.getItem("authToken");
      const role = sessionStorage.getItem("userRole");

      if (!token || role !== "admin") {
        setError("Unauthorized. Please log in as an admin.");
        return;
      }

      await axios.post(
        `${API_BASE_URL}/admin/change-password`,
        { email: selectedUser.email, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsPasswordModalOpen(false);
      setNewPassword("");
      setSuccessMessage("Password changed successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setError(error.response?.status === 403 ? "Access denied. Please check your permissions." : "Failed to change password. Please try again.");
      console.error("Error changing password:", error.response?.data || error.message);
    }
  };

  // Handle add user
  const handleAddUser = async () => {
    if (!newUserEmail || !newUserPassword) {
      setError("Please fill in all fields.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      const token = sessionStorage.getItem("authToken");
      const role = sessionStorage.getItem("userRole");

      if (!token || role !== "admin") {
        setError("Unauthorized. Please log in as an admin.");
        return;
      }

      await axios.post(
        `${API_BASE_URL}/register`,
        { email: newUserEmail, password: newUserPassword, role: newUserRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsAddUserModalOpen(false);
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserRole("store");
      setSuccessMessage("User added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);

      // Refresh user list
      const response = await axios.get(`${API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      setError(error.response?.status === 400 ? error.response.data.message : "Failed to add user. Please try again.");
      console.error("Error adding user:", error.response?.data || error.message);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 sm:p-8 pt-24">
      <Card className="w-full sm:w-auto bg-white shadow-lg rounded-lg p-6 sm:p-8 border-t-4 border-primary transform transition duration-300 ease-in-out">
        <CardContent>
          <h2 className="text-3xl font-semibold text-center text-primary mb-6">Manage Users</h2>

          {/* Search Bar */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between sm:flex-nowrap mb-6">
            <div className="flex flex-col sm:flex-row sm:space-x-4 w-full sm:flex-nowrap">
                <Input
                type="text"
                placeholder="Search by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary w-full whitespace-nowrap"
                />
            </div>
            </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center">
              <XCircle className="w-5 h-5 mr-2" /> {error}
            </div>
          )}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" /> {successMessage}
            </div>
          )}

          {/* Users Table */}
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="min-w-full table-auto border-collapse text-gray-800">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-6 py-4 text-left whitespace-nowrap">Email</th>
                    <th className="px-6 py-4 text-left whitespace-nowrap">2FA Status</th>
                    <th className="px-6 py-4 text-left whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {currentUsers.map((user, index) => (
                    <tr
                      key={user.email}
                      className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.has2FA ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-4 h-4 mr-1" /> Enabled
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <XCircle className="w-4 h-4 mr-1" /> Disabled
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              if (user.has2FA) {
                                setSelectedUser(user);
                                setIsRevokeModalOpen(true);
                              }
                            }}
                            className={`text-white rounded-lg shadow-sm text-sm px-3 py-1.5 transition-all duration-200 ${user.has2FA ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-300 cursor-not-allowed'}`}
                            disabled={!user.has2FA}
                            title={!user.has2FA ? "2FA is not enabled for this user" : ""}
                          >
                            <RefreshCw className="w-4 h-4 mr-2" /> Revoke 2FA
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedUser(user);
                              setIsPasswordModalOpen(true);
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm text-sm px-3 py-1.5 transition-all duration-200"
                          >
                            <Key className="w-4 h-4 mr-2" /> Change Password
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Add User Button and Pagination */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:justify-between items-center">
            {/* Pagination */}
            <div className="flex space-x-4 items-center sm:order-1 sm:flex-nowrap">
                <Button
                onClick={() => handlePageChange(currentPage - 1)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg p-2"
                disabled={currentPage === 1}
                >
                Previous
                </Button>
                <div className="flex items-center text-gray-600 text-sm">
                <span className="font-medium">Page {currentPage} of {totalPages}</span>
                </div>
                <Button
                onClick={() => handlePageChange(currentPage + 1)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg p-2"
                disabled={currentPage === totalPages}
                >
                Next
                </Button>
            </div>

            {/* Add User Button */}
            <Button
                onClick={() => setIsAddUserModalOpen(true)}
                className="mt-4 sm:mt-0 sm:order-2 bg-primary hover:bg-primary-dark text-white rounded-lg px-6 py-2 flex items-center transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary"
            >
                <Plus className="w-4 h-4 mr-2" /> Add a New User
            </Button>
            </div>
        </CardContent>
      </Card>

      {/* Revoke 2FA Modal */}
      {isRevokeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 transition-all transform">
          <Card className="w-full max-w-sm bg-white rounded-xl shadow-xl p-8 space-y-6">
            <h2 className="text-3xl font-semibold text-gray-800 text-center">Revoke 2FA</h2>
            <p className="text-lg text-gray-700 text-center">
              Are you sure you want to revoke 2FA for{" "}
              <span className="font-semibold">{selectedUser?.email}</span>?
            </p>
            <div className="flex justify-between gap-6 mt-8">
              <Button
                onClick={() => setIsRevokeModalOpen(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg py-3 px-8 transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleRevoke2FA(selectedUser.email)}
                className="bg-red-500 hover:bg-red-600 text-white rounded-lg py-3 px-8 transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Revoke
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 transition-all transform">
          <Card className="w-full max-w-sm bg-white rounded-xl shadow-xl p-8 space-y-6">
            <h2 className="text-3xl font-semibold text-gray-800 text-center">Change Password</h2>

            {/* New Password Field */}
            <div className="relative">
              <Input
                type={isPasswordVisible ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out hover:ring-2 hover:ring-blue-400"
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {isPasswordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Error and Success Messages */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center">
                <XCircle className="w-5 h-5 mr-2" /> {error}
              </div>
            )}
            {successMessage && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" /> {successMessage}
              </div>
            )}

            <div className="flex justify-between gap-6 mt-8">
              <Button
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setNewPassword("");
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg py-3 px-8 transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </Button>
              <Button
                onClick={handleChangePassword}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-3 px-8 transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Confirm
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 transition-all transform">
          <Card className="w-full max-w-sm bg-white rounded-xl shadow-xl p-8 space-y-6">
            <h2 className="text-3xl font-semibold text-gray-800 text-center">Add User</h2>

            {/* Email Field */}
            <Input
              type="email"
              placeholder="Email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              className="w-full px-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out hover:ring-2 hover:ring-blue-400"
            />

            {/* Password Field */}
            <div className="relative">
              <Input
                type={isNewUserPasswordVisible ? "text" : "password"}
                placeholder="Password"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                className="w-full px-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out hover:ring-2 hover:ring-blue-400"
              />
              <button
                type="button"
                onClick={() => setIsNewUserPasswordVisible(!isNewUserPasswordVisible)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {isNewUserPasswordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Role Selection Dropdown */}
            <div className="relative">
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
                className="w-full px-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out hover:ring-2 hover:ring-blue-400"
              >
                <option value="store">Store</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Error and Success Messages */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center">
                <XCircle className="w-5 h-5 mr-2" /> {error}
              </div>
            )}
            {successMessage && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" /> {successMessage}
              </div>
            )}

            <div className="flex justify-between gap-6 mt-8">
              <Button
                onClick={() => {
                  setIsAddUserModalOpen(false);
                  setNewUserEmail("");
                  setNewUserPassword("");
                  setNewUserRole("store");
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg py-3 px-8 transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddUser}
                className="bg-primary hover:bg-primary-dark text-white rounded-lg py-3 px-8 transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                Add User
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;