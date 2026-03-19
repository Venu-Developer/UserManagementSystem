import { useState, useEffect } from "react";
import { API } from "../api/api.js";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function EditProfile() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "",
    dob: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const nav = useNavigate();

  const calcAge = (dob) =>
    Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/user/profile");

        setForm({
          ...res.data,
          password: ""
        });
      } catch (err) {
        Swal.fire("Error", "Failed to load profile", "error");
      }
    };

    fetchProfile();
  }, []);

  const validate = () => {
    const err = {};

    if (!form.firstName.trim()) err.firstName = "First name required";
    if (!form.lastName.trim()) err.lastName = "Last name required";

    if (!form.email) {
      err.email = "Email required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      err.email = "Invalid email";
    }

    if (!form.gender) err.gender = "Select gender";
    if (!form.dob) err.dob = "DOB required";

    return err;
  };

  const submit = async () => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Swal.fire("Validation Error", "Please fix errors", "error");
      return;
    }

    try {
      setLoading(true);

      const payload = { ...form };
      if (!payload.password) delete payload.password;

      await API.put("/user/profile", payload);

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        timer: 1500,
        showConfirmButton: false
      });

      nav("/dashboard");

    } catch (err) {
      Swal.fire(
        "Update Failed",
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const age = form.dob ? calcAge(form.dob) : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      
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
            <h2 className="text-2xl font-semibold text-gray-900">Edit Profile</h2>
            <p className="text-gray-500 text-sm mt-1">Update your personal information</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          
          {/* Form */}
          <div className="space-y-5">
            
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  First Name
                </label>
                <input
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors bg-gray-50 ${
                    errors.firstName ? "border-red-300" : "border-gray-200"
                  }`}
                  placeholder="John"
                  value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <span>⚠</span>
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Last Name
                </label>
                <input
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors bg-gray-50 ${
                    errors.lastName ? "border-red-300" : "border-gray-200"
                  }`}
                  placeholder="Doe"
                  value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <span>⚠</span>
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors bg-gray-50 ${
                  errors.email ? "border-red-300" : "border-gray-200"
                }`}
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠</span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors bg-gray-50 pr-20"
                  type={showPassword ? "text" : "password"}
                  placeholder="Leave blank to keep current"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 text-sm font-medium"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Only fill this if you want to change your password
              </p>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Gender
              </label>
              <select
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors bg-gray-50 appearance-none ${
                  errors.gender ? "border-red-300" : "border-gray-200"
                }`}
                value={form.gender}
                onChange={e => setForm({ ...form, gender: e.target.value })}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠</span>
                  {errors.gender}
                </p>
              )}
            </div>

            {/* DOB and Age */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Date of Birth
                </label>
                <input
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors bg-gray-50 ${
                    errors.dob ? "border-red-300" : "border-gray-200"
                  }`}
                  type="date"
                  value={form.dob?.slice(0, 10) || ""}
                  onChange={e => setForm({ ...form, dob: e.target.value })}
                />
                {errors.dob && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <span>⚠</span>
                    {errors.dob}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Age
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                  type="number"
                  value={age}
                  readOnly
                  placeholder="Auto"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => nav("/dashboard")}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={submit}
                disabled={loading}
                className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>

          {/* Last Updated Note */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              ✎ Your information is securely stored
            </p>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-gray-400 text-xs mt-6">
          Fields marked with * are required
        </p>
      </div>
    </div>
  );
}