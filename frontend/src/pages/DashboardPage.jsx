import { useUser, useClerk } from "@clerk/react";
import { useEffect, useState } from "react";
import api from "../services/api.js";
import { Link } from "react-router";
import { CopyPlus, Bell } from "lucide-react";

export default function DashboardPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [authTest, setAuthTest] = useState(null);
  const [error, setError] = useState(null);
  const [adminTest, setAdminTest] = useState(null);

  useEffect(() => {
    const testAuth = async () => {
      try {
        const response = await api.get("/users/me");
        setAuthTest(response.data);
      } catch (err) {
        setError("Auth test failed — check the console.");
        console.error(err);
      }
    };
    testAuth();
  }, []);

  const triggerReminders = async () => {
    try {
      const response = await api.post("/admin/trigger-reminders");
      setAdminTest("Reminders triggered successfully: " + JSON.stringify(response.data));
    } catch (err) {
      console.error(err);
      setAdminTest("Failed to trigger reminders: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Welcome back, {user?.firstName || "there"} 👋
            </p>
          </div>
          <button
            onClick={() => signOut({ redirectUrl: "/" })}
            className="text-sm font-semibold text-gray-600 hover:text-gray-900 border border-gray-200 px-4 py-2 bg-white rounded-xl shadow-sm transition-all"
          >
            Sign out
          </button>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/subscriptions"
            className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-2xl hover:border-gray-300 hover:shadow-sm transition-all group"
          >
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-105 transition-transform">
              <CopyPlus size={20} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Subscriptions</p>
              <p className="text-xs text-gray-500 mt-0.5">Manage & track</p>
            </div>
          </Link>

          <Link
            to="/reminders"
            className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-2xl hover:border-gray-300 hover:shadow-sm transition-all group"
          >
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:scale-105 transition-transform">
              <Bell size={20} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Reminders</p>
              <p className="text-xs text-gray-500 mt-0.5">Upcoming renewals</p>
            </div>
          </Link>
        </div>

        {/* Auth test result */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
          <h2 className="font-medium text-gray-900">Auth verification</h2>
          {error ? (
            <p className="text-red-500 text-sm">{error}</p>
          ) : authTest ? (
            <div className="space-y-1 text-sm">
              <p className="text-green-600">✓ Token verified by backend</p>
              {/* This userId is what gets stored on every MongoDB document */}
              <p className="text-gray-500">
                User ID:{" "}
                <code className="bg-gray-100 px-1 rounded">
                  {authTest.userId}
                </code>
              </p>
              <p className="text-gray-500">
                Session ID:{" "}
                <code className="bg-gray-100 px-1 rounded truncate block text-xs mt-1">
                  {authTest.sessionId}
                </code>
              </p>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Testing auth...</p>
          )}
        </div>

        {/* Admin actions test */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
          <h2 className="font-medium text-gray-900">Admin Actions</h2>
          <button
            onClick={triggerReminders}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
          >
            Trigger Reminders
          </button>
          
          {adminTest && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 wrap-break-words">
              {adminTest}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
