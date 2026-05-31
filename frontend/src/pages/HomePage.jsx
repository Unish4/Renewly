import { Link, Navigate } from "react-router";
import { useAuth } from "@clerk/react";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  FilmIcon,
  Clock,
  Music,
  Cloud,
  Mail,
  BarChart3,
  Folder,
} from "lucide-react";

const HomePage = () => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="font-sans bg-white">
      {/* Hero Section */}
      <div className="min-h-screen lg:min-h-[90vh] bg-linear-to-br from-indigo-50 via-white to-blue-50 flex flex-col pt-20 px-6 sm:px-10 lg:px-20 overflow-hidden relative border-b border-indigo-50">
        {/* Background decoration */}
        <div className="absolute top-0 -left-4 w-64 h-64 md:w-96 md:h-96 bg-purple-300/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-64 h-64 md:w-96 md:h-96 bg-yellow-300/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-64 h-64 md:w-96 md:h-96 bg-pink-300/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>

        <div className="flex-1 max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 relative z-10 w-full mb-20 lg:mb-0">
          {/* Left/Top Content */}
          <div className="flex-1 space-y-8 text-center lg:text-left pt-12 lg:pt-0">
            <h1 className="text-5xl sm:text-5xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-tight">
              Take control of{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-blue-500">
                Subscriptions
              </span>
            </h1>

            <p className="text-lg sm:text-xl font-serif text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Never pay for an unused subscription again. Track your recurring
              expenses, get timely email reminders before you're billed, and
              save money effortlessly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4 tracking-wide">
              <Link
                to="/sign-up"
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 shadow-md text-lg"
              >
                Get Started for Free
              </Link>
              <Link
                to="/sign-in"
                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-bold rounded-xl border-2 border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 transition-all duration-300 shadow-sm text-lg"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Right/Bottom Image/Visual */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative hidden md:block">
            <div className="relative rounded-2xl bg-white p-8 shadow-2xl border border-slate-100 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="absolute top-3 right-4 bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Renews today
              </div>
              <div className="flex items-center gap-4 mb-8">
                <FilmIcon className="w-10 h-10 rounded-full flex items-center justify-center text-red-600 font-bold shadow-sm" />
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">
                    Netflix Premium
                  </h3>
                  <p className="text-slate-500 text-sm">Entertainment</p>
                </div>
                <div className="ml-auto text-right">
                  <span className="block font-bold text-slate-800 text-xl">
                    $19.99
                  </span>
                  <span className="text-slate-400 text-xs">/month</span>
                </div>
              </div>

              <div className="space-y-4 relative">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm">
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-700">
                      Spotify Premium
                    </h4>
                    <p className="text-slate-400 text-xs">Renews in 3 days</p>
                  </div>
                  <div className="ml-auto font-semibold text-slate-600">
                    $10.99
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold shadow-sm">
                    <Cloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-700">
                      Adobe Creative Cloud
                    </h4>
                    <p className="text-slate-400 text-xs">Renews next week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Everything you need to manage your subscriptions
              </h2>
              <p className="text-lg text-slate-600">
                Stop wasting money on services you no longer use. Renewly gives
                you full visibility and control over all your recurring expenses
                in one place.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
              {/* Feature 1 */}
              <div className="p-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-linear-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-indigo-200 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Timely Email Reminders
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Get notified via email before any subscription renews. Never
                  get caught off guard by an auto-renewal charge again.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-blue-200 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Spending Analytics
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Visualize where your money goes with beautiful charts. See
                  your monthly and yearly spending broken down by category.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-purple-200 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Folder className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Easy Tracking Options
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Add popular subscriptions from preset categories like
                  Entertainment or easily create custom entries for any service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
