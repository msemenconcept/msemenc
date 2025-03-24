
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-20">
        <div className="min-h-[60vh] flex items-center justify-center bg-beige">
          <div className="text-center p-8 max-w-md">
            <h1 className="text-8xl font-bold text-primary mb-4 font-playfair">404</h1>
            <p className="text-2xl text-secondary mb-6 font-playfair">Oops! Page non trouvée</p>
            <p className="text-gray-700 mb-8">
              La page que vous recherchez n'existe pas ou a été déplacée.
            </p>
            <Link
              to="/"
              className="btn-primary py-3 px-6 inline-block"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
