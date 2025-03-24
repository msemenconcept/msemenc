
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import Features from '@/components/home/Features';
import Specialties from '@/components/home/Specialties';
import Process from '@/components/home/Process';
import Stats from '@/components/home/Stats';
import CallToAction from '@/components/home/CallToAction';
import Contact from '@/components/home/Contact';
import { useCart } from '@/hooks/useCart';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [showCart, setShowCart] = useState(false);
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const { toast } = useToast();

  // Handle cart toggle
  useEffect(() => {
    const handleToggleCart = () => {
      setShowCart(prev => !prev);
    };

    window.addEventListener('toggle-cart', handleToggleCart);
    return () => {
      window.removeEventListener('toggle-cart', handleToggleCart);
    };
  }, []);

  // Close cart when clicking outside
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

  // Handle removing items from cart
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

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex-grow">
        <Hero />
        <About />
        <Features />
        <Specialties />
        <Process />
        <Stats />
        <CallToAction />
        <Contact />
      </main>
      <Footer />

      {/* Shopping Cart Overlay */}
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
                  <div className="divide-y">
                    <AnimatePresence>
                      {cartItems.map((item) => (
                        <motion.div 
                          key={item.id} 
                          className="py-4 flex items-center"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ type: "spring", stiffness: 100 }}
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
                  </div>
                  
                  <div className="border-t mt-4 pt-4">
                    <div className="flex justify-between items-center font-bold text-xl mb-6">
                      <span>Total</span>
                      <span>{subtotal.toFixed(2)} DH</span>
                    </div>
                    
                    <motion.button
                      onClick={() => window.location.href = '/order'}
                      className="w-full btn-primary py-3 flex items-center justify-center shadow-lg hover:shadow-xl"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Passer la commande
                      <ShoppingCart className="ml-2 h-5 w-5" />
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500 mb-4">Votre panier est vide</p>
                  <motion.button
                    onClick={() => window.location.href = '/order'}
                    className="btn-primary py-2 px-4 flex items-center justify-center mx-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Commander
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
