
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="bg-primary py-16">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4 font-playfair">
            Commandez en Ligne et Savourez chez Vous!
          </h2>
          <p className="text-secondary/80 mb-8 text-lg">
            Profitez de nos délicieuses spécialités marocaines depuis le confort de votre maison. 
            Commandez en ligne et recevez vos pâtisseries traditionnelles fraîchement préparées.
          </p>
          <Link 
            to="/order" 
            className="inline-flex items-center bg-secondary text-white font-medium py-3 px-6 rounded-lg hover:bg-secondary/90 transition-colors"
          >
            Commander Maintenant
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
