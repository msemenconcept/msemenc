
import { Users, Package, Clock, Book } from 'lucide-react';

const stats = [
  {
    icon: Users,
    count: '1000+',
    label: 'Clients Satisfaits'
  },
  {
    icon: Package,
    count: '10000+',
    label: 'Commandes Préparées'
  },
  {
    icon: Clock,
    count: '1+',
    label: 'Années d\'Experience'
  },
  {
    icon: Book,
    count: '10+',
    label: 'Recettes Exclusives'
  }
];

const Stats = () => {
  return (
    <section className="py-16 bg-beige">
      <div className="section-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-secondary mb-1">{stat.count}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
