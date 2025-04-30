import React from 'react';
import './SeibabInformation.css';

const SeibabInformation = () => {
  const dogs = [
    {
      name: 'Bruno',
      image: 'https://via.placeholder.com/250x180?text=Dog+1',
      desc: 'A strong, energetic Seibab with a gentle personality.'
    },
    {
      name: 'Luna',
      image: 'https://via.placeholder.com/250x180?text=Dog+2',
      desc: 'Loyal and affectionate. Great with kids and families.'
    },
    {
      name: 'Max',
      image: 'https://via.placeholder.com/250x180?text=Dog+3',
      desc: 'Protective and smart. Makes a great guardian.'
    },
    {
      name: 'Zara',
      image: 'https://via.placeholder.com/250x180?text=Dog+4',
      desc: 'Playful Seibab pup, eager to learn and explore.'
    },
    {
      name: 'Duke',
      image: 'https://via.placeholder.com/250x180?text=Dog+5',
      desc: 'Calm temperament and very obedient in training.'
    }
  ];

  return (
    <div className="seibab-info-container">
      <h1>Available Seibabs</h1>
      <div className="seibab-listings">
        {dogs.map((dog, index) => (
          <div className="dog-card" key={index}>
            <img src={dog.image} alt={dog.name} />
            <h2>{dog.name}</h2>
            <p>{dog.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeibabInformation;
