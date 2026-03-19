import { useState } from "react";
import { API } from "../api/api.js";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: ""
  });

  const [show, setShow] = useState({
    old: false,
    new: false
  });

  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const validate = () => {
    if (!form.oldPassword) {
      Swal.fire("Error", "Old password required", "error");
      return false;
    }

    if (!form.newPassword) {
      Swal.fire("Error", "New password required", "error");
      return false;
    }

    if (form.newPassword.length < 6) {
      Swal.fire("Error", "Minimum 6 characters required", "error");
      return false;
    }

    return true;
  };

  const submit = async () => {
    if (!validate()) return;

    const confirm = await Swal.fire({
      title: "Change Password?",
      text: "Do you want to update your password?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update"
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);

      await API.put("/user/password", {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword
      });

      Swal.fire({
        icon: "success",
        title: "Password Updated",
        timer: 1500,
        showConfirmButton: false
      });

      nav("/dashboard");

    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      
      {/* Main Card */}
      <div className="w-full max-w-md">
        
        {/* Header with back button */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => nav(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow text-gray-600 hover:text-gray-900"
          >
            ←
          </button>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Change Password</h2>
            <p className="text-gray-500 text-sm mt-1">Update your account password</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          
          {/* Password Requirements */}
          <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
              <span>🔒</span>
              Password Requirements
            </h3>
            <ul className="text-xs text-blue-600 space-y-1">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                Minimum 6 characters
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                Use a different password than your old one
              </li>
            </ul>
          </div>

          {/* Form */}
          <div className="space-y-5">
            
            {/* Old Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={show.old ? "text" : "password"}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors bg-gray-50 pr-20"
                  placeholder="Enter current password"
                  value={form.oldPassword}
                  onChange={e => setForm({ ...form, oldPassword: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShow({ ...show, old: !show.old })}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 text-sm font-medium"
                >
                  {show.old ? "Hide" : "Show"}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Your current password
              </p>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  type={show.new ? "text" : "password"}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors bg-gray-50 pr-20"
                  placeholder="Enter new password"
                  value={form.newPassword}
                  onChange={e => setForm({ ...form, newPassword: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShow({ ...show, new: !show.new })}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 text-sm font-medium"
                >
                  {show.new ? "Hide" : "Show"}
                </button>
              </div>
              
              {/* Password strength indicator */}
              {form.newPassword && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          form.newPassword.length < 6 
                            ? "w-1/3 bg-red-400" 
                            : form.newPassword.length < 10 
                            ? "w-2/3 bg-yellow-400" 
                            : "w-full bg-green-400"
                        }`}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {form.newPassword.length < 6 
                        ? "Weak" 
                        : form.newPassword.length < 10 
                        ? "Medium" 
                        : "Strong"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Password match hint */}
            {form.oldPassword && form.newPassword && form.oldPassword === form.newPassword && (
              <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                <p className="text-xs text-red-600 flex items-center gap-2">
                  <span>⚠</span>
                  New password must be different from current password
                </p>
              </div>
            )}

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
                disabled={loading || form.oldPassword === form.newPassword}
                className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              🔐 Your password is encrypted and securely stored
            </p>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-gray-400 text-xs mt-6">
          Choose a strong password you haven't used before
        </p>
      </div>
    </div>
  );
}