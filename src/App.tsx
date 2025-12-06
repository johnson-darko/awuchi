import React, { useState, useEffect } from 'react';
import ServiceList from './components/ServiceList';
import GalleryModal from './components/GalleryModal';
import './App.css';

const categories = [
  {
    key: 'sedan',
    label: 'Sedan / Small Car',
    examples: 'Honda Civic, Toyota Corolla, Ford Focus',
  },
  {
    key: 'suv',
    label: 'SUV / Mid-Size SUV',
    examples: 'RAV4, CR-V, Escape, Highlander',
  },
  {
    key: 'large',
    label: 'Large SUV / Minivan',
    examples: 'Chevy Tahoe, Honda Pilot, Sienna, Expedition',
  },
  {
    key: 'truck',
    label: 'Truck',
    examples: 'Ram 1500, Ford F-150, Silverado, Tesla Cybertruck',
  },
];

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('sedan');
  const [galleryOpen, setGalleryOpen] = useState(true);

  useEffect(() => {
    setGalleryOpen(true);
  }, []);

  return (
    <div className="pw-root">
      <GalleryModal open={galleryOpen} onClose={() => setGalleryOpen(false)} />
      <header className="pw-header">
        <div className="pw-logo">PerfectWash</div>
      </header>
      <main>
        <section className="pw-banner">
          <h1>Waterless Home Car Wash & Detailing</h1>
          <p className="pw-banner-desc">We Come to You. No water, no mess.</p>
        </section>
        <section className="pw-category-select">
          <div className="pw-category-label">Select your vehicle type:</div>
          <div className="pw-category-btns">
            {categories.map(cat => (
              <button
                key={cat.key}
                className={`pw-category-btn${selectedCategory === cat.key ? ' active' : ''}`}
                onClick={() => setSelectedCategory(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="pw-category-examples">
            <b>Examples:</b> {categories.find(c => c.key === selectedCategory)?.examples}
          </div>
        </section>
        <ServiceList category={selectedCategory} />
        <section className="pw-note">
          <b>Exterior jobs:</b> Available anytime.<br />
          <b>Interior jobs:</b> Only done before 6 PM.<br />
          <b>Combo (Interior + Exterior):</b> Only done before 6 PM.<br /> <hr />
          Paint transfer, stains,pet hair or spills → extra charge depending on damage.
        </section>
        <section className="pw-book-btns">
          <a className="pw-book-btn" href="https://wa.me/16824175791?text=I%20want%20to%20book%20a%20car%20wash" target="_blank" rel="noopener noreferrer">Book via WhatsApp</a>
          <a className="pw-book-btn" href="tel:+16824175791">Call to Book</a>
        </section>
        <div className="pw-payment">Payment: <b>Cash or Zelle Only</b></div>
      </main>
    </div>
  );
};

export default App;
