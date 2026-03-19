import { useState } from "react";
import { API } from "../api/api.js";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function DeleteAccount() {
  const [data, setData] = useState({
    email: "",
    dob: ""
  });

  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const validate = () => {
    if (!data.email || !data.dob) {
      Swal.fire("Error", "Email and DOB required", "error");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      Swal.fire("Error", "Invalid email format", "error");
      return false;
    }

    return true;
  };

  const submit = async () => {
    if (!validate()) return;

    const confirm = await Swal.fire({
      title: "Are you absolutely sure?",
      text: "This action cannot be undone! Your account will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, delete my account",
      cancelButtonText: "No, keep it"
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);

      await API.delete("/user/delete", { data });

      await Swal.fire({
        icon: "success",
        title: "Account Deleted",
        text: "Your account has been permanently removed",
        timer: 1500,
        showConfirmButton: false
      });

      localStorage.removeItem("token");
      nav("/login");

    } catch (err) {
      Swal.fire(
        "Delete Failed",
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      
      {/* Warning Background Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-200 rounded-full opacity-10"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-300 rounded-full opacity-10"></div>
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-md">
        
        {/* Header with back button */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => nav(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow text-gray-600 hover:text-gray-900"
          >
            ←
          </button>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Delete Account</h2>
            <p className="text-gray-500 text-sm mt-1">This action is permanent</p>
          </div>
        </div>

        {/* Danger Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-red-500">
          
          {/* Warning Header */}
          <div className="flex items-center gap-3 mb-6 p-4 bg-red-50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xl">
              ⚠️
            </div>
            <div>
              <h3 className="font-semibold text-red-700">Danger Zone</h3>
              <p className="text-xs text-red-600">
                Once you delete your account, there's no going back
              </p>
            </div>
          </div>

          {/* Warning List */}
          <div className="mb-6 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-red-400">•</span>
              <span>All your personal data will be removed</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-red-400">•</span>
              <span>Your profile and posts will be deleted</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-red-400">•</span>
              <span>You'll lose access to all services</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-red-400">•</span>
              <span>This action cannot be reversed</span>
            </div>
          </div>

          {/* Confirmation Text */}
          <p className="text-sm font-medium text-gray-700 mb-4">
            Please confirm your identity to continue:
          </p>

          {/* Form */}
          <div className="space-y-4">
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors bg-gray-50"
                type="email"
                placeholder="Enter your email"
                value={data.email}
                onChange={e => setData({ ...data, email: e.target.value })}
              />
            </div>

            {/* DOB */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Date of Birth
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors bg-gray-50"
                type="date"
                value={data.dob}
                onChange={e => setData({ ...data, dob: e.target.value })}
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Enter your date of birth to confirm
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => nav(-1)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={submit}
                disabled={loading || !data.email || !data.dob}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Deleting...
                  </>
                ) : (
                  "Delete Account"
                )}
              </button>
            </div>
          </div>

          {/* Final Warning */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              ⚠️ This action is irreversible. Please be certain.
            </p>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-gray-400 text-xs mt-6">
          Need help? Contact support before deleting your account
        </p>
      </div>
    </div>
  );
}