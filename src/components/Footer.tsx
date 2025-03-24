
import { Link } from 'react-router-dom';
import { Instagram, MessageSquare, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* About Us */}
          <div>
            <h3 className="text-xl font-playfair font-bold mb-4">À Propos</h3>
            <div className="w-12 h-1 bg-primary mb-4"></div>
            <p className="mb-4 text-sm leading-relaxed">
              Msemen Concept est une entreprise spécialisée dans la préparation 
              de pâtisseries marocaines traditionnelles avec une touche moderne et innovante.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com/msemen_concept" className="social-icon text-white hover:text-primary" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://wa.me/212614882878" className="social-icon text-white hover:text-primary" target="_blank" rel="noopener noreferrer">
                <MessageSquare className="h-5 w-5" />
              </a>
              <a href="mailto:contact@msemenconcept.ma" className="social-icon text-white hover:text-primary">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-playfair font-bold mb-4">Contact</h3>
            <div className="w-12 h-1 bg-primary mb-4"></div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                <span>Rue mexique, Tanger, Morocco</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-primary" />
                <a href="tel:+212614882878" className="hover:text-primary transition-colors">+212 614882878</a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-primary" />
                <a href="mailto:contact@msemenconcept.ma" className="hover:text-primary transition-colors">contact@msemenconcept.ma</a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-xl font-playfair font-bold mb-4">Horaires</h3>
            <div className="w-12 h-1 bg-primary mb-4"></div>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Lundi - Vendredi:</span>
                <span>9:00 - 22:00</span>
              </li>
              <li className="flex justify-between">
                <span>Samedi:</span>
                <span>10:00 - 22:00</span>
              </li>
              <li className="flex justify-between">
                <span>Dimanche:</span>
                <span>Fermé</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} - Msemen Concept. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
