import { useUser, useClerk } from "@clerk/react";
import { useEffect, useState } from "react";
import api from "../services/api.js";

export default function DashboardPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [authTest, setAuthTest] = useState(null);
  const [error, setError] = useState(null);

  // Hit the protected /api/users/me endpoint to confirm the full
  // auth flow works end-to-end: token attached → backend verifies → returns userId.
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome, {user?.firstName || "there"} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {user?.emailAddresses[0]?.emailAddress}
            </p>
          </div>
          <button
            onClick={() => signOut({ redirectUrl: "/sign-in" })}
            className="text-sm text-gray-500 hover:text-gray-900 border border-gray-200 px-4 py-2 rounded-lg transition-colors"
          >
            Sign out
          </button>
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
                <code className="bg-gray-100 px-1 rounded">
                  {authTest.sessionId}
                </code>
              </p>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Testing auth...</p>
          )}
        </div>

        <p className="text-gray-400 text-sm text-center">
          Dashboard content coming in Phase 3
        </p>
      </div>
    </div>
  );
}
