import { useState, useEffect } from "react";
import { Search, ShoppingCart, Plus, Minus, X, Filter } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";

const categories = ['Tous', 'Concept', 'Salés', 'Standards', 'Boissons Chauds', 'Boissons Fraiches'];

const products = [
  // Concept Category
  {
    id: 1,
    name: 'Concept Poulet',
    category: 'Concept',
    price: 12.00,
    image: 'https://i.postimg.cc/rFDvV2h1/concept-poulet.jpg',
    description: 'Msemen fourré au poulet avec des oignons caramélisés',
    detailedDescription: 'Notre Concept Poulet est une création signature où le msemen traditionnel rencontre une garniture savoureuse de poulet tendre et d\'oignons caramélisés. La douceur des oignons complète parfaitement les épices marocaines, le tout enveloppé dans notre pâte feuilletée préparée à la main. Un choix parfait pour un repas léger ou un en-cas substantiel.'
  },
  {
    id: 2,
    name: 'Concept Viande Hachée',
    category: 'Concept',
    price: 17.00,
    image: 'https://i.postimg.cc/c19pGLc1/concept-vh.jpg',
    description: 'Msemen fourré à la viande hachée aux épices marocaines',
    detailedDescription: 'Notre Concept Viande Hachée est préparé avec une garniture généreuse de viande hachée assaisonnée aux épices marocaines authentiques. La viande est cuite lentement avec un mélange d\'oignons, d\'ail et d\'herbes fraîches, puis enveloppée dans notre pâte à msemen légère et feuilletée. Un plat copieux qui évoque les saveurs du Maroc.'
  },
  {
    id: 3,
    name: 'Concept Nutella',
    category: 'Concept',
    price: 10.00,
    image: 'https://i.postimg.cc/hv56L2GQ/concept-nutella.jpg',
    description: 'Msemen fourré au Nutella et aux noix concassées',
    detailedDescription: 'Pour les amateurs de sucré, notre Concept Nutella est un délice irrésistible. Le msemen chaud enveloppe une généreuse couche de Nutella fondant et des noix concassées, créant un contraste parfait entre la texture croustillante de la pâte et la douceur fondante du chocolat. Une gourmandise à partager... ou pas!'
  },
  
  // Salés Category
  {
    id: 4,
    name: 'Salé Légumes et Fromage',
    category: 'Salés',
    price: 6.00,
    image: 'https://i.postimg.cc/NGmdpGPP/sale-legume.jpg',
    description: 'Msemen aux légumes frais de saison et fromage',
    detailedDescription: 'Notre Salé Légumes et Fromage est une option savoureuse et nutritive qui combine des légumes frais de saison avec du fromage fondant, le tout enveloppé dans notre pâte à msemen traditionnelle. Les légumes sont légèrement sautés pour préserver leur croquant, tandis que le fromage apporte une richesse crémeuse.'
  },
  {
    id: 5,
    name: 'Salé Poulet',
    category: 'Salés',
    price: 7.00,
    image: 'https://i.postimg.cc/MTthT62D/sale-poulet.jpg',
    description: 'Msemen salé au poulet épicé',
    detailedDescription: 'Notre Salé Poulet est une option délicieuse qui combine du poulet tendre légèrement épicé avec des herbes fraîches, le tout enveloppé dans notre pâte à msemen traditionnelle. Le poulet est cuit avec un mélange subtil d\'épices marocaines qui rehaussent sa saveur sans être trop dominant.'
  },
  {
    id: 6,
    name: 'Salé Viande Hachée',
    category: 'Salés',
    price: 8.00,
    image: 'https://i.postimg.cc/C519n3wV/sale-vh.jpg',
    description: 'Msemen salé à la viande hachée assaisonnée',
    detailedDescription: 'Notre Salé Viande Hachée est préparé avec une garniture généreuse de viande hachée parfaitement assaisonnée avec des épices marocaines traditionnelles. La viande est cuite lentement pour développer ses saveurs et est ensuite enveloppée dans notre pâte à msemen légère. Un classique de la cuisine marocaine revisité avec notre touche spéciale.'
  },
  
  // Standards Category
  {
    id: 7,
    name: 'Rghifa Normal',
    category: 'Standards',
    price: 2.50,
    image: 'https://i.postimg.cc/SRh7w8t1/rghifa-1.jpg',
    description: 'Rghifa traditionnelle préparée à la main',
    detailedDescription: 'Notre Rghifa Normal est une crêpe traditionnelle marocaine préparée à la main selon les méthodes ancestrales. Sa pâte fine et feuilletée est étirée avec expertise pour créer de multiples couches qui deviennent légères et croustillantes à la cuisson. Parfaite pour accompagner une tasse de thé à la menthe ou pour être dégustée avec du miel.'
  },
  {
    id: 8,
    name: 'Rghifa Zrae',
    category: 'Standards',
    price: 3.00,
    image: 'https://i.postimg.cc/j24QK5px/rghifa-complet.jpg',
    description: 'Rghifa à la farine complète pour plus de saveur',
    detailedDescription: 'Notre Rghifa Zrae est une version plus nutritive de la rghifa traditionnelle, préparée avec de la farine complète qui lui confère une saveur plus prononcée et des bienfaits nutritionnels supplémentaires. Sa texture reste légère et feuilletée, avec une belle coloration dorée. Un choix parfait pour ceux qui recherchent une option plus saine sans sacrifier le goût authentique.'
  },
  {
    id: 9,
    name: 'Meloui Normal',
    category: 'Standards',
    price: 2.00,
    image: 'https://i.postimg.cc/9M3G7ZVX/meloui-2.webp',
    description: 'Meloui traditionnel à la pâte finement travaillée',
    detailedDescription: 'Notre Meloui Normal est une spécialité marocaine emblématique. Sa pâte est travaillée avec soin selon la méthode traditionnelle puis pliée en spirale pour créer ces couches distinctives qui lui donnent sa texture caractéristique. Léger et aérien, il est parfait pour le petit-déjeuner ou comme accompagnement de plats en sauce.'
  },
  {
    id: 10,
    name: 'Meloui Zrae',
    category: 'Standards',
    price: 2.50,
    image: 'https://i.postimg.cc/B6DBYNN1/meloui-1.jpg',
    description: 'Meloui complet aux céréales variées',
    detailedDescription: 'Notre Meloui Zrae est une version nutritive du meloui traditionnel, préparé avec un mélange de farines complètes et de céréales qui lui confèrent une saveur plus riche et des qualités nutritionnelles supérieures. Sa texture reste fidèle au meloui classique, avec ses nombreuses couches créées par le pliage en spirale caractéristique.'
  },
  
  // Boissons Chauds Category
  {
    id: 11,
    name: 'Café Normal',
    category: 'Boissons Chauds',
    price: 5.00,
    image: 'https://i.postimg.cc/QdhNHMRL/cafe.webp',
    description: 'Café noir intense à l\'arabe',
    detailedDescription: 'Notre Café Normal est un café noir intense préparé à l\'arabe, avec une légère note de cardamome qui lui confère son arôme distinctif. Servi dans une petite tasse traditionnelle, il offre une expérience gustative riche et authentique qui complète parfaitement nos pâtisseries.'
  },
  {
    id: 12,
    name: 'Café au Lait',
    category: 'Boissons Chauds',
    price: 7.00,
    image: 'https://i.postimg.cc/tJFyg0kC/dolcevita-cortado-macchiato-sans-sucre-dolce-vita.webp',
    description: 'Café doux adouci au lait frais',
    detailedDescription: 'Notre Café au Lait combine l\'intensité de notre café spécial avec la douceur du lait frais. La proportion parfaite de café et de lait crée une boisson équilibrée qui conserve les notes aromatiques du café tout en offrant une texture crémeuse et une douceur naturelle. Une option plus douce pour accompagner nos douceurs sucrées.'
  },
  {
    id: 13,
    name: 'Thé à la Menthe',
    category: 'Boissons Chauds',
    price: 8.00,
    image: 'https://i.postimg.cc/L6z69PQB/the-a-la-menthe-Palais-Faraj-1.webp',
    description: 'Thé traditionnel marocain à la menthe fraîche et au sucre',
    detailedDescription: 'Notre Thé à la Menthe est préparé selon la tradition marocaine: du thé vert de qualité, une généreuse quantité de menthe fraîche et du sucre, le tout servi dans un verre à thé traditionnel. Cette boisson emblématique accompagne parfaitement nos pâtisseries et offre une expérience authentiquement marocaine.'
  },
  
  // Boissons Fraiches Category
  {
    id: 14,
    name: 'Jus de Citron',
    category: 'Boissons Fraiches',
    price: 9.00,
    image: 'https://i.postimg.cc/fT4RQCCR/zitronensaft-titelbild.jpg',
    description: 'Jus de citron frais pressé, naturellement rafraîchissant',
    detailedDescription: 'Notre Jus de Citron est pressé à la minute à partir de citrons frais et juteux. Sa fraîcheur acidulée et revitalisante en fait un choix parfait pour accompagner nos plats salés ou pour se rafraîchir pendant les journées chaudes. Servi avec ou sans sucre selon votre préférence, c\'est une boisson simple mais délicieuse qui met en valeur le goût pur du citron.'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
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

const cartItemVariants = {
  hidden: { x: 20, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  },
  exit: { 
    x: 20, 
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const OrderPage = () => {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const { toast } = useToast();
  const { cartItems, addToCart, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  useEffect(() => {
    const handleToggleCart = () => {
      setShowCart(prev => !prev);
    };

    window.addEventListener('toggle-cart', handleToggleCart);
    return () => {
      window.removeEventListener('toggle-cart', handleToggleCart);
    };
  }, []);

  const filteredProducts = products
    .filter(product => activeCategory === 'Tous' || product.category === activeCategory)
    .filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleProductClick = (product: typeof products[0]) => {
    setSelectedProduct(product);
    setQuantity(1);
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

  const handleRemoveFromCart = (id: number) => {
    const itemToRemove = cartItems.find(item => item.id === id);
    if (itemToRemove) {
      toast({
        title: "Produit retiré",
        description: `${itemToRemove.name} retiré du panier`,
        variant: "default",
      });
    }
    removeFromCart(id);
  };

  const subtotal = getTotalPrice();
  
  const openOrderConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName || !customerPhone || cartItems.length === 0) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs et ajouter des produits au panier.",
        variant: "destructive",
      });
      return;
    }
    
    setShowOrderConfirmation(true);
  };

  const handleCheckout = () => {
    const orderDetails = cartItems.map(item => 
      `${item.name} x${item.quantity} - ${(item.price * item.quantity).toFixed(2)}DH`
    ).join('\n');
    
    const message = `
*Nouvelle Commande - Msemen Concept*
----------------------------------
*Nom*: ${customerName}
*Téléphone*: ${customerPhone}

*Commande*:
${orderDetails}

*Total*: ${subtotal.toFixed(2)}DH
    `;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/212614882878?text=${encodedMessage}`;
    
    window.open(whatsappLink, '_blank');
    
    toast({
      title: "Commande envoyée",
      description: "Votre commande a été envoyée avec succès!",
      variant: "default",
    });
    
    setCustomerName('');
    setCustomerPhone('');
    setShowCart(false);
    setShowOrderConfirmation(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showCart && !target.closest('.cart-container') && !target.closest('.cart-button')) {
        setShowCart(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCart]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow pt-20">
        <div className="hero-section h-60 relative" style={{ backgroundImage: 'url("https://i.postimg.cc/rFDvV2h1/concept-poulet.jpg")' }}>
          <div className="hero-overlay bg-gradient-to-r from-secondary/80 to-secondary/90"></div>
          <div className="hero-content">
            <motion.h1 
              className="text-4xl font-bold font-playfair mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Commander
            </motion.h1>
            <motion.div 
              className="w-16 h-1 bg-primary mx-auto mb-4"
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ duration: 0.8 }}
            ></motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Découvrez et commandez nos délicieuses spécialités marocaines
            </motion.p>
          </div>
        </div>
        
        <section className="section-container py-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="relative w-full md:w-auto">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                className="w-full md:w-80 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <button 
                className="md:hidden flex items-center justify-center space-x-2 bg-gray-100 text-secondary font-medium py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors shadow-sm"
                onClick={() => setShowCategoryFilter(!showCategoryFilter)}
              >
                <Filter className="h-5 w-5" />
                <span>Catégories</span>
              </button>
            </div>
          </div>
          
          <div className={`flex flex-wrap justify-center gap-2 mb-8 ${showCategoryFilter ? 'block' : 'hidden md:flex'}`}>
            {categories.map((category) => (
              <motion.button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <motion.div 
                  key={product.id} 
                  className="product-card group animate-fade-in hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden"
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                    <h3 className="product-title font-medium">{product.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{product.description}</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="product-price">{product.price.toFixed(2)} DH</span>
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
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
              </div>
            )}
          </motion.div>
        </section>
      </main>
      
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
      
      <AnimatePresence>
        {showCart && (
          <motion.div 
            className="fixed inset-0 bg-black/50 z-50 flex justify-end backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="cart-container w-full max-w-md bg-white h-full overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
            >
              <div className="sticky top-0 bg-white z-10 shadow-sm">
                <div className="flex justify-between items-center p-4 border-b">
                  <h2 className="text-xl font-bold font-playfair">Votre Panier</h2>
                  <motion.button 
                    className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    onClick={() => setShowCart(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.button>
                </div>
              </div>
              
              {cartItems.length > 0 ? (
                <div className="p-4">
                  <motion.div 
                    className="divide-y"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <AnimatePresence>
                      {cartItems.map((item) => (
                        <motion.div 
                          key={item.id} 
                          className="py-4 flex items-center"
                          variants={cartItemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          layout
                        >
                          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden mr-4 shadow-sm">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover object-center"
                            />
                          </div>
                          <div className="flex-grow">
                            <h3 className="text-secondary font-medium">{item.name}</h3>
                            <p className="text-primary font-bold">{item.price.toFixed(2)} DH</p>
                          </div>
                          <div className="flex items-center">
                            <motion.button 
                              className="text-gray-500 hover:text-primary p-1 hover:bg-gray-100 rounded-full transition-colors"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Minus className="h-4 w-4" />
                            </motion.button>
                            <span className="mx-2 w-8 text-center font-medium">{item.quantity}</span>
                            <motion.button 
                              className="text-gray-500 hover:text-primary p-1 hover:bg-gray-100 rounded-full transition-colors"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Plus className="h-4 w-4" />
                            </motion.button>
                            <motion.button 
                              className="ml-4 text-gray-400 hover:text-red-500 p-1 hover:bg-gray-100 rounded-full transition-colors"
                              onClick={() => handleRemoveFromCart(item.id)}
                              whileTap={{ scale: 0.9 }}
                            >
                              <X className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                  
                  <div className="border-t mt-4 pt-4">
                    <div className="flex justify-between items-center font-bold text-xl mb-6">
                      <span>Total</span>
                      <span>{subtotal.toFixed(2)} DH</span>
                    </div>
                    
                    <form onSubmit={openOrderConfirmation}>
                      <div className="space-y-4 mb-6">
                        <div>
                          <label htmlFor="name" className="block text-gray-700 font-medium mb-1">Nom</label>
                          <input
                            type="text"
                            id="name"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="Votre nom"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-gray-700 font-medium mb-1">Téléphone</label>
                          <input
                            type="tel"
                            id="phone"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="Votre numéro de téléphone"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <motion.button
                        type="submit"
                        className="w-full btn-primary py-3 flex items-center justify-center shadow-lg hover:shadow-xl"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Passer la commande
                        <ShoppingCart className="ml-2 h-5 w-5" />
                      </motion.button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500">Votre panier est vide</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showOrderConfirmation && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-xl font-bold mb-4">Confirmer votre commande</h3>
              <p className="mb-4">Vous êtes sur le point de passer une commande pour:</p>
              
              <div className="mb-4 max-h-40 overflow-y-auto">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between mb-2">
                    <span>{item.name} x{item.quantity}</span>
                    <span className="font-bold">{(item.price * item.quantity).toFixed(2)} DH</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{subtotal.toFixed(2)} DH</span>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setShowOrderConfirmation(false)}
                >
                  Annuler
                </button>
                <motion.button
                  className="flex-1 btn-primary py-2 px-4 rounded-lg shadow-md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                >
                  Confirmer
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Footer />
    </div>
  );
};

export default OrderPage;
