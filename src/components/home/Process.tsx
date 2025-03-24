
import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Sélection des Ingrédients',
    description: 'Nous sélectionnons uniquement les meilleurs ingrédients frais de haute qualité.'
  },
  {
    number: '02',
    title: 'Préparation Traditionnelle',
    description: 'Nos artisans préparent la pâte selon des techniques marocaines ancestrales.'
  },
  {
    number: '03',
    title: 'Cuisson Maîtrisée',
    description: "Chaque msemen est cuit à la perfection pour un résultat moelleux à l'intérieur et croustillant à l'extérieur."
  },
  {
    number: '04',
    title: 'Service Impeccable',
    description: 'Nous vous servons nos produits frais du jour, emballés avec soin pour préserver toutes leurs saveurs.'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const lineVariants = {
  hidden: { width: 0, opacity: 0 },
  visible: {
    width: "100%",
    opacity: 0.3,
    transition: { 
      delay: 1,
      duration: 0.8
    }
  }
};

const Process = () => {
  return (
    <section className="bg-secondary text-white py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-primary/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-primary/20 to-transparent"></div>
      </div>
      
      <div className="section-container relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold font-playfair mb-2"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Notre Process
          </motion.h2>
          <motion.div 
            className="w-16 h-1 bg-primary mx-auto mb-4"
            initial={{ width: 0 }}
            whileInView={{ width: 64 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          ></motion.div>
          <motion.p 
            className="max-w-2xl mx-auto text-white/80"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            viewport={{ once: true }}
          >
            Découvrez comment nous préparons nos msemens et autres pâtisseries marocaines traditionnelles.
          </motion.p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="relative"
              variants={itemVariants}
            >
              <div className="mb-6">
                <motion.span 
                  className="text-6xl font-bold text-primary/30 font-playfair"
                  whileHover={{ scale: 1.1, color: "#F4BC3A" }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {step.number}
                </motion.span>
              </div>
              <h3 className="text-xl font-medium mb-3">{step.title}</h3>
              <p className="text-white/70">{step.description}</p>
              
              {index < steps.length - 1 && (
                <motion.div 
                  className="hidden lg:block absolute top-12 right-0 transform translate-x-1/2 w-full"
                  variants={lineVariants}
                >
                  <div className="w-full h-1 bg-primary/30"></div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Process;
