
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section className="section-container py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div 
          className="order-2 md:order-1"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <span className="inline-block bg-primary/20 text-secondary px-4 py-1 rounded-full text-sm font-medium mb-4">
            Notre Histoire
          </span>
          <h2 className="section-title text-4xl md:text-5xl mb-6">Où la Tradition Rencontre l'Innovation</h2>
          <div className="w-20 h-1 bg-primary mb-8"></div>
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              Chez Msemen Concept, nous croyons à l'authenticité des saveurs traditionnelles marocaines tout en y apportant une touche moderne. Notre passion pour la cuisine marocaine est au cœur de chacune de nos créations.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Fondé à Tanger, Msemen Concept s'engage à vous offrir le meilleur des pâtisseries marocaines, préparées avec des ingrédients frais et selon des recettes authentiques transmises de génération en génération.
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-8"
          >
            <Link to="/order" className="group inline-flex items-center bg-secondary text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              Découvrir nos produits
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </motion.div>
        <motion.div 
          className="order-1 md:order-2"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="relative">
            <div className="relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-500">
              <img 
                src="https://i.postimg.cc/rFDvV2h1/concept-poulet.jpg" 
                alt="Msemen Concept Poulet" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-2xl font-semibold">Msemen Concept</p>
                <p className="opacity-80">Notre signature</p>
              </div>
            </div>
            
            <motion.div 
              className="absolute -bottom-6 -right-6 bg-primary p-5 rounded-2xl shadow-xl"
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <p className="text-secondary font-bold text-2xl">+1</p>
              <p className="text-secondary font-medium">Ans d'Excellence</p>
            </motion.div>
            
            <div className="absolute -top-6 -left-6 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl transform rotate-12 hover:rotate-0 transition-all duration-300">
              <p className="text-secondary font-medium text-sm">100% Authentique</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
