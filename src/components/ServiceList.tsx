import React from 'react';

type Category = 'sedan' | 'suv' | 'large' | 'truck';

const pricing: Record<Category, { exterior: string; interior: string; full: string; combo: string }> = {
  sedan: {
    exterior: '$20',
    interior: '$20',
    full: '$25',
    combo: '$40',
  },
  suv: {
    exterior: '$30',
    interior: '$30',
    full: '$35',
    combo: '$50',
  },
  large: {
    exterior: '$40',
    interior: '$40',
    full: '$45',
    combo: '$60',
  },
  truck: {
    exterior: '$50',
    interior: '$50',
    full: '$55',
    combo: '$70',
  },
};

interface ServiceListProps {
  category: Category;
}

const services = [
  {
    icon: '🚗',
    title: 'Exterior Wash',
    key: 'exterior',
    desc: 'Full outside body waterless wash + tire cleaning',
  },
  {
    icon: '🧼',
    title: 'Interior Detailing',
    key: 'interior',
    desc: 'Seats, mats, dashboard, center console, front and back inside mirrors, side mirrors, and inner doors',
  },
  {
    icon: '🔎',
    title: 'Full Interior + Trunk',
    key: 'full',
    desc: 'Interior including trunk area',
  },
  {
    icon: '💎',
    title: 'Combo Exterior Wash + Interior Detailing',
    key: 'combo',
    desc: 'Full cleaning package. Best value.',
  },
];

const ServiceList: React.FC<ServiceListProps> = ({ category }) => (
  <section className="pw-services">
    {services.map((service, idx) => (
      <div className="pw-service-card" key={idx}>
        <div className="pw-service-info">
          <div className="pw-service-icon">{service.icon}</div>
          <div>
            <div className="pw-service-title">{service.title} <span className="pw-service-price">{pricing[category][service.key as keyof typeof pricing[Category]]}</span></div>
            <div className="pw-service-desc">{service.desc}</div>
          </div>
        </div>
      </div>
    ))}
  </section>
);

export default ServiceList;
