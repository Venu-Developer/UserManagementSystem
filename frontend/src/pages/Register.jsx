import { useState } from "react";
import { API } from "../api/api.js";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dob: ""
  });

  const [errors, setErrors] = useState({});
  const [show, setShow] = useState({
    password: false,
    confirm: false
  });

  const nav = useNavigate();

  const calcAge = (dob) =>
    Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000));

  const validate = () => {
    const err = {};

    if (!form.firstName.trim()) err.firstName = "First name required";
    if (!form.lastName.trim()) err.lastName = "Last name required";

    if (!form.email) {
      err.email = "Email required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      err.email = "Invalid email";
    }

    if (!form.password) {
      err.password = "Password required";
    } else if (form.password.length < 6) {
      err.password = "Minimum 6 characters";
    }

    if (form.password !== form.confirmPassword) {
      err.confirmPassword = "Passwords do not match";
    }

    if (!form.gender) err.gender = "Select gender";
    if (!form.dob) err.dob = "DOB required";

    return err;
  };

  const submit = async () => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await API.post("/auth/signup", {
        ...form,
        age: calcAge(form.dob)
      });

      nav("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const age = form.dob ? calcAge(form.dob) : "";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Simple card */}
      <div className="w-full max-w-md">
        {/* Header with back button */}
        <div className="mb-6 flex items-center gap-4">
          {/* <button
            onClick={() => nav(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow text-gray-600 hover:text-gray-900"
          >
            ←
          </button> */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Create account</h2>
            <p className="text-gray-500 text-sm mt-1">Please fill in your details</p>
          </div>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-5">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First name
                </label>
                <input
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors bg-gray-50"
                  placeholder="John"
                  value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last name
                </label>
                <input
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors bg-gray-50"
                  placeholder="Doe"
                  value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors bg-gray-50"
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors bg-gray-50"
                  type={show.password ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShow({ ...show, password: !show.password })}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-sm"
                >
                  {show.password ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm password
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors bg-gray-50"
                  type={show.confirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShow({ ...show, confirm: !show.confirm })}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-sm"
                >
                  {show.confirm ? "Hide" : "Show"}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors bg-gray-50 text-gray-900"
                value={form.gender}
                onChange={e => setForm({ ...form, gender: e.target.value })}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
              )}
            </div>

            {/* DOB and Age */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of birth
                </label>
                <input
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors bg-gray-50"
                  type="date"
                  value={form.dob}
                  onChange={e => setForm({ ...form, dob: e.target.value })}
                />
                {errors.dob && (
                  <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                  type="number"
                  value={age}
                  readOnly
                  placeholder="Auto"
                />
              </div>
            </div>

            {/* Register button */}
            <button
              onClick={submit}
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors mt-6"
            >
              Create account
            </button>

            {/* Login link */}
            <p className="text-center text-gray-500 text-sm">
              Already have an account?{" "}
              <button
                onClick={() => nav("/login")}
                className="text-gray-900 font-medium hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}