
import { useState } from 'react';
import { ArrowRight, ShoppingCart, X, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useToast } from "@/hooks/use-toast";
import { useCart } from '@/hooks/useCart';

const categories = ['Tous', 'Concept', 'Salés', 'Standards', 'Boissons'];

const products = [
  {
    id: 1,
    name: 'Concept Poulet',
    category: 'Concept',
    price: 12.00,
    image: 'https://i.postimg.cc/rFDvV2h1/concept-poulet.jpg',
    description: 'Msemen fourré au poulet avec des oignons caramélisés',
    featured: true,
    detailedDescription: 'Notre Concept Poulet est une création signature où le msemen traditionnel rencontre une garniture savoureuse de poulet tendre et d\'oignons caramélisés. La douceur des oignons complète parfaitement les épices marocaines, le tout enveloppé dans notre pâte feuilletée préparée à la main. Un choix parfait pour un repas léger ou un en-cas substantiel.'
  },
  {
    id: 2,
    name: 'Concept Viande Hachée',
    category: 'Concept',
    price: 17.00,
    image: 'https://i.postimg.cc/c19pGLc1/concept-vh.jpg',
    description: 'Msemen fourré à la viande hachée aux épices marocaines',
    featured: true,
    detailedDescription: 'Notre Concept Viande Hachée est préparé avec une garniture généreuse de viande hachée assaisonnée aux épices marocaines authentiques. La viande est cuite lentement avec un mélange d\'oignons, d\'ail et d\'herbes fraîches, puis enveloppée dans notre pâte à msemen légère et feuilletée. Un plat copieux qui évoque les saveurs du Maroc.'
  },
  {
    id: 3,
    name: 'Concept Nutella',
    category: 'Concept',
    price: 10.00,
    image: 'https://i.postimg.cc/hv56L2GQ/concept-nutella.jpg',
    description: 'Msemen fourré au Nutella et aux noix concassées',
    featured: true,
    detailedDescription: 'Pour les amateurs de sucré, notre Concept Nutella est un délice irrésistible. Le msemen chaud enveloppe une généreuse couche de Nutella fondant et des noix concassées, créant un contraste parfait entre la texture croustillante de la pâte et la douceur fondante du chocolat. Une gourmandise à partager... ou pas!'
  },
  {
    id: 4,
    name: 'Salé Légumes et Fromage',
    category: 'Salés',
    price: 6.00,
    image: 'https://i.postimg.cc/NGmdpGPP/sale-legume.jpg',
    description: 'Msemen aux légumes frais de saison et fromage',
    featured: true,
    detailedDescription: 'Notre Salé Légumes et Fromage est une option savoureuse et nutritive qui combine des légumes frais de saison avec du fromage fondant, le tout enveloppé dans notre pâte à msemen traditionnelle. Les légumes sont légèrement sautés pour préserver leur croquant, tandis que le fromage apporte une richesse crémeuse.'
  },
  {
    id: 5,
    name: 'Rghifa Normal',
    category: 'Standards',
    price: 2.50,
    image: 'https://i.postimg.cc/SRh7w8t1/rghifa-1.jpg',
    description: 'Rghifa traditionnelle préparée à la main',
    featured: true,
    detailedDescription: 'Notre Rghifa Normal est une crêpe traditionnelle marocaine préparée à la main selon les méthodes ancestrales. Sa pâte fine et feuilletée est étirée avec expertise pour créer de multiples couches qui deviennent légères et croustillantes à la cuisson. Parfaite pour accompagner une tasse de thé à la menthe ou pour être dégustée avec du miel.'
  },
  {
    id: 6,
    name: 'Thé à la Menthe',
    category: 'Boissons',
    price: 8.00,
    image: 'https://i.postimg.cc/L6z69PQB/the-a-la-menthe-Palais-Faraj-1.webp',
    description: 'Thé traditionnel marocain à la menthe fraîche et au sucre',
    featured: true,
    detailedDescription: 'Notre Thé à la Menthe est préparé selon la tradition marocaine: du thé vert de qualité, une généreuse quantité de menthe fraîche et du sucre, le tout servi dans un verre à thé traditionnel. Cette boisson emblématique accompagne parfaitement nos pâtisseries et offre une expérience authentiquement marocaine.'
  }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
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

const Specialties = () => {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const { addToCart } = useCart();

  const filteredProducts = activeCategory === 'Tous' 
    ? products.filter(product => product.featured) 
    : products.filter(product => product.category === activeCategory);

  const handleProductClick = (product: typeof products[0]) => {
    setSelectedProduct(product);
    setQuantity(1); // Reset quantity when opening a new product
    setIsDialogOpen(true);
  };

  const increaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  const handleAddToCart = (product: typeof products[0], quantity: number) => {
    // Add to cart using the context
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    }, quantity);
    
    toast({
      title: "Produit ajouté",
      description: `${quantity}x ${product.name} ajouté au panier`,
      variant: "default",
    });
    
    setIsDialogOpen(false);
  };

  return (
    <section className="section-container py-16 bg-white">
      <div className="text-center mb-12">
        <h2 className="section-title">Nos Spécialités</h2>
        <div className="w-16 h-1 bg-primary mx-auto mb-4"></div>
        <p className="text-gray-700 max-w-2xl mx-auto">
          Découvrez nos délicieuses créations, préparées avec passion et savoir-faire marocain.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((category) => (
          <motion.button
            key={category}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-sm
              ${activeCategory === category
                ? 'bg-primary text-secondary shadow-md scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            onClick={() => setActiveCategory(category)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category}
          </motion.button>
        ))}
      </div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredProducts.map((product) => (
          <motion.div 
            key={product.id} 
            className="product-card group hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden"
            variants={itemVariants}
          >
            <div className="relative overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="product-image h-64 w-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-2 right-2">
                <span className="badge">{product.category}</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                <motion.button 
                  className="bg-primary text-secondary font-medium py-2 px-4 rounded-full transform translate-y-10 group-hover:translate-y-0 transition-transform duration-300 flex items-center shadow-md"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleProductClick(product)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" /> 
                  Voir détails
                </motion.button>
              </div>
            </div>
            <div className="product-info p-5">
              <h3 className="product-title text-lg font-medium">{product.name}</h3>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="product-price text-xl">{product.price.toFixed(2)} DH</span>
                <motion.button 
                  className="btn-primary flex items-center shadow-md hover:shadow-lg transform transition hover:-translate-y-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleProductClick(product)}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" /> 
                  Ajouter
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="text-center mt-12">
        <Link 
          to="/order" 
          className="inline-flex items-center text-secondary font-medium hover:text-primary transition-colors group"
        >
          Voir tous nos produits
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Product Preview Dialog */}
      <AnimatePresence>
        {isDialogOpen && selectedProduct && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogOverlay className="backdrop-blur-sm" />
            <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-xl border-none shadow-2xl">
              <DialogTitle className="sr-only">
                <VisuallyHidden>{selectedProduct.name}</VisuallyHidden>
              </DialogTitle>
              <motion.div 
                className="flex flex-col md:flex-row"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="md:w-1/2 relative h-64 md:h-auto">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <motion.button
                      className="bg-white rounded-full p-1.5 shadow-md"
                      onClick={() => setIsDialogOpen(false)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="h-5 w-5 text-gray-600" />
                    </motion.button>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="badge bg-primary text-secondary">{selectedProduct.category}</span>
                  </div>
                </div>
                <div className="md:w-1/2 p-6 md:p-8 bg-white">
                  <h3 className="text-2xl font-bold font-playfair mb-2">{selectedProduct.name}</h3>
                  <p className="text-primary text-xl font-bold mb-4">{selectedProduct.price.toFixed(2)} DH</p>
                  <div className="mb-6">
                    <h4 className="text-sm uppercase tracking-wider text-gray-600 mb-2">Description</h4>
                    <p className="text-gray-800">{selectedProduct.detailedDescription}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm uppercase tracking-wider text-gray-600">Quantité</span>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <motion.button 
                        className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100"
                        onClick={decreaseQuantity}
                        whileTap={{ scale: 0.9 }}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </motion.button>
                      <span className="px-4 py-2 font-medium">{quantity}</span>
                      <motion.button 
                        className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100"
                        onClick={increaseQuantity}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Plus className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Total:</span>
                    <span className="text-primary font-bold">{(selectedProduct.price * quantity).toFixed(2)} DH</span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <motion.button
                      className="w-full btn-primary py-3 flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAddToCart(selectedProduct, quantity)}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Ajouter au panier
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Specialties;
