
import { MapPin, Phone, Clock, Mail, MessageSquare, Instagram } from 'lucide-react';

const ContactInfo = () => {
  return (
    <section className="section-container" id="contact">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="animate-fade-in">
          <h2 className="section-title">Contactez-Nous</h2>
          <div className="w-16 h-1 bg-primary mb-6"></div>
          <p className="mb-8 text-gray-700">
            Nous sommes toujours à votre disposition pour répondre à vos questions et vous accueillir dans notre boutique.
          </p>

          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-secondary mb-1">Adresse</h3>
                <p className="text-gray-700">Rue mexique, Tanger, Morocco</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-secondary mb-1">Téléphone</h3>
                <p className="text-gray-700">
                  <a href="tel:+212614882878" className="hover:text-primary transition-colors">+212 614882878</a>
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-secondary mb-1">Email</h3>
                <p className="text-gray-700">
                  <a href="mailto:contact@msemenconcept.ma" className="hover:text-primary transition-colors">contact@msemenconcept.ma</a>
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-secondary mb-1">Horaires d'Ouverture</h3>
                <p className="text-gray-700">Lundi - Vendredi: 9:00 - 22:00</p>
                <p className="text-gray-700">Samedi: 10:00 - 22:00</p>
                <p className="text-gray-700">Dimanche: Fermé</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                <Instagram className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-secondary mb-1">Réseaux Sociaux</h3>
                <div className="flex space-x-3">
                  <a href="https://instagram.com/msemen_concept" className="text-gray-700 hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="https://wa.me/212614882878" className="text-gray-700 hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden animate-fade-in">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3237.933527575806!2d-5.81493509999999!3d35.77950920000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0c79007598cf69%3A0xe3663863ebebab1f!2sMsemen%20Concept!5e0!3m2!1sen!2sma!4v1742824954482!5m2!1sen!2sma" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Msemen Concept Location"
            className="w-full h-full"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
