import React from 'react';
import './GalleryModal.css';

const images = [
  {
    before: 'https://res.cloudinary.com/orlandodarko/image/upload/v1764995839/i2xwfy79plm9td3pncnm.jpg',
    after: 'https://res.cloudinary.com/orlandodarko/image/upload/v1764997193/ptrwid0aie6d03f5caly.jpg',
  },
  
  {
    before: 'https://res.cloudinary.com/orlandodarko/image/upload/v1764996455/e18d1crolp581zvtd2ka.png',
    after: 'https://res.cloudinary.com/orlandodarko/image/upload/v1764996738/vapikvnysx3biqfdxshv.jpg',
  },
  {
    before: 'https://res.cloudinary.com/orlandodarko/image/upload/v1764995598/leufbeckdgmxffsdgo2f.jpg',
    after: 'https://res.cloudinary.com/orlandodarko/image/upload/v1764995639/ymnt8wxaoynjxxhjxjrl.jpg',
  },
  {
    before: 'https://res.cloudinary.com/orlandodarko/image/upload/v1764995849/prksquwt9atftprliffx.jpg',
    after: 'https://res.cloudinary.com/orlandodarko/image/upload/v1764995899/szlbyxmh6w0avjyszejc.jpg',
  },
];

interface GalleryModalProps {
  open?: boolean;
  onClose?: () => void;
}

const GalleryModal: React.FC<GalleryModalProps> = () => {
  return (
    <div className="pw-gallery-modal">
      <h3>Before & After Gallery</h3>
      <div className="pw-gallery-grid">
        {images.map((img, idx) => (
          <div className="pw-gallery-pair" key={idx}>
            <div>
              <img src={img.before} alt={`Before ${idx + 1}`} />
              <div className="pw-gallery-label">Before</div>
            </div>
            <div>
              <img src={img.after} alt={`After ${idx + 1}`} />
              <div className="pw-gallery-label">After</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryModal;
