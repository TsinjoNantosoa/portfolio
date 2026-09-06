import { Link } from "react-router-dom";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-white">
      <Header />
      <main className="site-container flex flex-col items-start justify-center pb-24 pt-32">
        <p className="mb-3 font-mono text-sm text-neon">404</p>
        <h1 className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          Page not found
        </h1>
        <p className="mb-8 max-w-md text-[15px] text-[var(--text-secondary)]">
          This route does not exist. Head back to the homepage or selected work.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/" className="btn-neon">
            Back to home
          </Link>
          <Link to="/#work" className="btn-outline">
            View work
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
