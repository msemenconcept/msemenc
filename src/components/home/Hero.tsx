
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  const scrollToNextSection = () => {
    // Scroll to the About section
    const aboutSection = document.querySelector('.section-container');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section min-h-screen relative pt-20 flex items-center" 
      style={{ 
        backgroundImage: 'url("https://i.postimg.cc/rFDvV2h1/concept-poulet.jpg")',
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content max-w-4xl z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          <motion.span 
            className="inline-block bg-primary text-secondary px-6 py-2 rounded-full text-sm font-medium mb-6 shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
          >
            Msemen Concept by Bouti
          </motion.span>
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Savourez l'Authenticité <br className="hidden md:block" /> Marocaine
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Découvrez le goût authentique des pâtisseries marocaines traditionnelles préparées avec passion et savoir-faire.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/order" className="btn-primary py-4 px-8 text-lg shadow-xl hover:shadow-2xl inline-block">
                Commander Maintenant
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/order" className="inline-flex items-center justify-center text-white border-2 border-white py-4 px-8 rounded text-lg transition-all hover:bg-white/10 shadow-xl">
                Découvrir le Menu
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll down indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          delay: 1.5,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 0.5
        }}
        onClick={scrollToNextSection}
      >
        <div className="flex flex-col items-center text-white">
          <span className="text-sm mb-2">Découvrez Plus</span>
          <ChevronDown className="h-6 w-6 animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
