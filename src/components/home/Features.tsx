
import { Leaf, HandMetal, UtensilsCrossed, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Leaf,
    title: 'Ingrédients Frais',
    description: 'Nous sélectionnons uniquement les meilleurs ingrédients frais pour garantir une qualité supérieure.'
  },
  {
    icon: HandMetal,
    title: 'Fait Main',
    description: 'Chaque msemen est préparé à la main selon des techniques traditionnelles marocaines.'
  },
  {
    icon: UtensilsCrossed,
    title: 'Recettes Authentiques',
    description: "Nos recettes sont authentiques et s'inspirent de la riche tradition culinaire marocaine."
  },
  {
    icon: CheckCircle,
    title: 'Fraîcheur Garantie',
    description: 'Nous vous garantissons des produits frais préparés quotidiennement pour une qualité optimale.'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const Features = () => {
  return (
    <section className="bg-beige py-20">
      <div className="section-container">
        <div className="text-center mb-16">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Pourquoi Choisir Msemen Concept?
          </motion.h2>
          <motion.div 
            className="w-16 h-1 bg-primary mx-auto mb-4"
            initial={{ width: 0 }}
            whileInView={{ width: 64 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          ></motion.div>
          <motion.p 
            className="text-gray-700 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            viewport={{ once: true }}
          >
            Nous nous engageons à offrir des pâtisseries marocaines de qualité supérieure préparées avec passion et savoir-faire.
          </motion.p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="feature-card group bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              variants={itemVariants}
              whileHover={{ 
                y: -10,
                transition: { type: "spring", stiffness: 300 }
              }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-medium text-secondary mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
