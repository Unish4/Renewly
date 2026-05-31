import { useUser, useClerk } from "@clerk/react";
import { Link } from "react-router";
import { CopyPlus, Bell } from "lucide-react";

export default function DashboardPage() {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 -left-4 w-64 h-64 md:w-96 md:h-96 bg-purple-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
      <div className="absolute top-0 -right-4 w-64 h-64 md:w-96 md:h-96 bg-yellow-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
      <div className="absolute bottom-0 left-1/2 w-64 h-64 md:w-96 md:h-96 bg-pink-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>

      <div className="relative z-10 max-w-5xl mx-auto p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-slate-900 to-slate-700 tracking-tight">
              Dashboard
            </h1>
            <p className="text-slate-500 text-sm sm:text-base mt-1 font-medium">
              Welcome back,{" "}
              <span className="text-indigo-600 font-bold">
                {user?.firstName || "there"}
              </span>{" "}
              👋
            </p>
          </div>
          <button
            onClick={() => signOut({ redirectUrl: "/" })}
            className="w-full sm:w-auto text-sm font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 border-2 border-slate-200 hover:border-red-100 px-6 py-2.5 bg-white rounded-xl shadow-sm transition-all duration-300 text-center"
          >
            Sign out
          </button>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Link
            to="/subscriptions"
            className="flex items-center gap-5 sm:gap-6 p-5 sm:p-6 bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 hover:border-indigo-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            <div className="p-4 bg-linear-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl group-hover:scale-110 group-hover:shadow-indigo-200 group-hover:shadow-lg transition-all duration-300">
              <CopyPlus size={28} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-lg sm:text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                Subscriptions
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Manage & track expenses
              </p>
            </div>
          </Link>

          <Link
            to="/reminders"
            className="flex items-center gap-5 sm:gap-6 p-5 sm:p-6 bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 hover:border-blue-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            <div className="p-4 bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-2xl group-hover:scale-110 group-hover:shadow-blue-200 group-hover:shadow-lg transition-all duration-300">
              <Bell size={28} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-lg sm:text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                Reminders
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Upcoming renewals
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
