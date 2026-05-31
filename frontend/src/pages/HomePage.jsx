import { Link, Navigate } from 'react-router';
import { useAuth } from '@clerk/react';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage = () => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Brand */}
        <div className="inline-block p-4 bg-gray-900 rounded-2xl mb-4">
          <span className="text-3xl font-bold text-white tracking-tight">
            Renewly
          </span>
        </div>

        {/* Hero Text */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            Never pay for an unused subscription again.
          </h1>
          <p className="text-lg text-gray-500 max-w-md mx-auto">
            Track your recurring expenses, get email reminders before you're billed, and take back control of your money.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/sign-up"
            className="w-full sm:w-auto px-8 py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
          >
            Get Started Free
          </Link>
          <Link
            to="/sign-in"
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-gray-900 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
