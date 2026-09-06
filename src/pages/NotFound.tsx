import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404: route not found:", location.pathname);
  }, [location.pathname]);

  return (
<<<<<<< HEAD
    <div className="flex min-h-screen items-center justify-center bg-[#070A0D] px-4">
      <div className="text-center">
        <p className="mb-3 font-mono text-sm text-neon">404</p>
        <h1 className="mb-3 text-3xl font-semibold text-[#F5F7FA]">Page not found</h1>
        <p className="mb-6 text-white/60">The page you requested does not exist.</p>
        <Link
          to="/"
          className="inline-flex min-h-11 items-center rounded-full bg-neon px-5 py-2.5 text-sm font-semibold text-black"
        >
          Back to home
        </Link>
=======
    <div className="flex min-h-screen max-w-full items-center justify-center overflow-x-clip bg-gray-100 px-4">
      <div className="min-w-0 text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
>>>>>>> 4738555d5281ba89bdd2674124bd862d97d03e99
      </div>
    </div>
  );
};

export default NotFound;
