import React from 'react';
import './Home.css';

// replace these with your real assets
import mainVideo from '../assets/SK1.mp4';
import thumb1 from '../assets/dog1.jpg';
import thumb2 from '../assets/dog2.jpg';
import thumb3 from '../assets/dog3.jpg';
import thumb4 from '../assets/dog4.jpg';

const Home = () => {
  return (
    <div className="home-page">
      <div className="media-grid">
        {/* Big main video */}
        <div className="media-main">
          <video
            src={mainVideo}
            autoPlay
            loop
            muted
            controls={false}
            className="media-main-video"
          />
        </div>

        {/* 4 placeholder thumbs */}
        <div className="media-thumb">
          <img src={thumb1} alt="Placeholder 1" />
        </div>
        <div className="media-thumb">
          <img src={thumb2} alt="Placeholder 2" />
        </div>
        <div className="media-thumb">
          <img src={thumb3} alt="Placeholder 3" />
        </div>
        <div className="media-thumb">
          <img src={thumb4} alt="Placeholder 4" />
        </div>
      </div>
    </div>
  );
};

export default Home;
