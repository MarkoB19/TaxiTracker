import React, { useEffect, useState } from 'react';
import { CarFront, DollarSign, BarChart } from 'lucide-react';

const SplashScreen: React.FC = () => {
  const [showIcons, setShowIcons] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mount
    setTimeout(() => setShowIcons(true), 100);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white mb-2 transition-all duration-700 transform translate-y-0 opacity-100">
            TaxiTracker
          </h1>
          <p className="text-blue-100 text-sm">
            Your Personal Taxi Business Assistant
          </p>
        </div>
        
        <div className="flex justify-center space-x-8">
          {[
            { Icon: CarFront, delay: '100' },
            { Icon: DollarSign, delay: '200' },
            { Icon: BarChart, delay: '300' }
          ].map(({ Icon, delay }, index) => (
            <div
              key={index}
              className={`transform transition-all duration-700 ${
                showIcons
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: `${delay}ms` }}
            >
              <Icon 
                size={32} 
                className="text-white"
                strokeWidth={1.5}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;