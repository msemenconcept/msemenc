
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Index from './pages/Index';
import Order from './pages/Order';
import NotFound from './pages/NotFound';
import { Toaster } from './components/ui/toaster';
import { CartProvider } from './hooks/useCart';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/order" element={<Order />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </CartProvider>
  );
}

export default App;
