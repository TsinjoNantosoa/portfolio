import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404: route not found:", location.pathname);
  }, [location.pathname]);

  return (
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
      </div>
    </div>
  );
};

export default NotFound;
