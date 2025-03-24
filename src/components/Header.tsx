
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, Home, Utensils } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/hooks/useCart';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { cartItems, getTotalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const validPaths = ['/', '/order'];

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const searchVariants = {
    hidden: { opacity: 0, width: 0 },
    visible: { 
      opacity: 1, 
      width: '100%',
      transition: {
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      width: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center relative z-10">
          <motion.div 
            className="h-12 w-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <img 
              src="https://i.postimg.cc/D0Y2DQx1/logo-clear.png" 
              alt="Msemen Concept Logo" 
              className="h-full w-auto"
            />
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <motion.nav 
          className="hidden md:flex space-x-6 items-center"
          initial="hidden"
          animate="visible"
          variants={navVariants}
        >
          {validPaths.map((path) => (
            path === '/' ? 
              <motion.div key={path} variants={itemVariants}>
                <Link 
                  to={path} 
                  className={`nav-link flex items-center ${isActive(path) ? 'nav-link-active' : ''}`}
                >
                  <Home className="mr-1 h-4 w-4" />
                  Accueil
                </Link>
              </motion.div>
            : path === '/order' ?
              <motion.div key={path} variants={itemVariants}>
                <Link 
                  to={path} 
                  className={`nav-link flex items-center ${isActive(path) ? 'nav-link-active' : ''}`}
                >
                  <Utensils className="mr-1 h-4 w-4" />
                  Commander
                </Link>
              </motion.div>
            : null
          ))}
          <motion.button 
            variants={itemVariants}
            onClick={() => window.dispatchEvent(new CustomEvent('toggle-cart'))}
            className="btn-primary flex items-center shadow-md hover:shadow-lg relative cart-button"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Panier
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-primary text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </motion.button>
          <motion.button 
            variants={itemVariants}
            className="text-secondary hover:text-primary transition-colors p-2 hover:bg-gray-100 rounded-full"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Search"
          >
            {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </motion.button>
        </motion.nav>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden flex items-center space-x-4">
          <button 
            className="text-secondary hover:text-primary transition-colors p-2 hover:bg-gray-100 rounded-full relative cart-button"
            onClick={() => window.dispatchEvent(new CustomEvent('toggle-cart'))}
          >
            <ShoppingCart className="h-5 w-5" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-primary text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </button>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-secondary hover:text-primary transition-colors p-2 hover:bg-gray-100 rounded-full"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            className="absolute top-full left-0 w-full bg-white shadow-md py-4 px-6"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={searchVariants}
          >
            <div className="container mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Rechercher un produit..." 
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  autoFocus
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="md:hidden absolute top-full left-0 w-full bg-white shadow-md overflow-hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
          >
            <nav className="flex flex-col py-4 px-6">
              {validPaths.map((path) => (
                path === '/' ? 
                  <Link 
                    key={path} 
                    to={path} 
                    className={`nav-link flex items-center py-3 ${isActive(path) ? 'nav-link-active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Home className="mr-2 h-5 w-5" />
                    Accueil
                  </Link>
                : path === '/order' ?
                  <Link 
                    key={path} 
                    to={path} 
                    className={`nav-link flex items-center py-3 ${isActive(path) ? 'nav-link-active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Utensils className="mr-2 h-5 w-5" />
                    Commander
                  </Link>
                : null
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
