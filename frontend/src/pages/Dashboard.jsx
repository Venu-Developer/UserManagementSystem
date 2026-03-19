import { useEffect, useState, useContext } from "react";
import { API } from "../api/api.js";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext.jsx";
import { FaUserCircle } from "react-icons/fa";
export default function Dashboard() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const { logout } = useContext(AuthContext);
  const nav = useNavigate();

 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/user/profile");
        setUser(res.data);
      } catch (err) {
        Swal.fire("Error", "Failed to load profile", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    const confirm = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, logout"
    });

    if (!confirm.isConfirmed) return;

    localStorage.removeItem("token");
    logout?.();

    setUser({});

    Swal.fire({
      icon: "success",
      title: "Logged out",
      timer: 1000,
      showConfirmButton: false
    });

    nav("/login");
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setUser({ ...user, profileImage: preview });

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("profileImage", file);

      const res = await API.put("/user/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setUser(res.data);

      Swal.fire({
        icon: "success",
        title: "Profile Image Updated",
        timer: 1200,
        showConfirmButton: false
      });

    } catch (err) {
      Swal.fire(
        "Upload Failed",
        err.response?.data?.message || "Error uploading image",
        "error"
      );
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      
      {/* Header with logout */}
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 bg-white rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2"
          >
            <span>←</span>
            Logout
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Left Column - Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              
              {/* Profile Image */}
              <div className="flex flex-col items-center">
                <label className="cursor-pointer relative group">
                 

<div className="relative">
  {user?.profileImage && user?.profileImage!=null ? (
    <img
      src={
        user.profileImage.startsWith("blob")
          ? user.profileImage
          // : `http://localhost:5000${user.profileImage}`
          :`https://usermanagementsystem-venu-developer.onrender.com${user.profileImage}`
      }
      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
      alt="Profile"
    />
  ) : (
    <FaUserCircle className="w-32 h-32 text-gray-400" />
  )}
</div>
                  
                  <input 
                    type="file" 
                    hidden 
                    onChange={handleImage}
                    accept="image/*"
                  />
                </label>

                <h2 className="text-xl font-bold text-gray-900 mt-4">
                  {user.firstName || "User"} {user.lastName || ""}
                </h2>
                
                <p className="text-gray-500 text-sm mt-1">
                  {user.email || "No email provided"}
                </p>

                {/* Quick stats */}
                <div className="w-full mt-6 pt-6 border-t border-gray-100">
                  <div className="flex justify-around text-center">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {user.age || "—"}
                      </p>
                      <p className="text-xs text-gray-500">Age</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {user.gender ? user.gender[0].toUpperCase() : "—"}
                      </p>
                      <p className="text-xs text-gray-500">Gender</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details & Actions */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Profile Details Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Profile Information
              </h3>
              
              <div className="space-y-4">
                {/* Name */}
                <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 text-center text-gray-400">👤</div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="text-gray-900 font-medium">
                      {user.firstName || "Not set"} {user.lastName || ""}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 text-center text-gray-400">📧</div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Email Address</p>
                    <p className="text-gray-900 font-medium break-all">
                      {user.email || "Not set"}
                    </p>
                  </div>
                </div>

                {/* Gender */}
                <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 text-center text-gray-400">⚥</div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Gender</p>
                    <p className="text-gray-900 font-medium">
                      {user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : "Not set"}
                    </p>
                  </div>
                </div>

                {/* DOB & Age combined */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Date of Birth</p>
                    <p className="text-gray-900 font-medium">
                      {user.dob ? new Date(user.dob).toLocaleDateString() : "Not set"}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Age</p>
                    <p className="text-gray-900 font-medium">
                      {user.age ? `${user.age} years` : "Not set"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Account Management
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => nav("/edit")}
                  className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <span>✎</span>
                  Edit Profile
                </button>
                
                <button
                  onClick={() => nav("/change-password")}
                  className="w-full bg-amber-500 text-white py-3 rounded-xl font-medium hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
                >
                  <span>🔒</span>
                  Change Password
                </button>
                
                <button
                  onClick={() => nav("/delete")}
                  className="w-full bg-white text-red-600 py-3 rounded-xl font-medium border-2 border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                >
                  <span>🗑️</span>
                  Delete Account
                </button>
              </div>

              {/* Account age */}
              {user.createdAt && (
                <p className="text-xs text-gray-400 text-center mt-4">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}