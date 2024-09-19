// BirdComponent.js
import React, { useEffect, useState } from 'react';

const BirdComponent = () => {
  const [isFlying, setIsFlying] = useState(true);
  const [birdPosition, setBirdPosition] = useState({ x: 0, y: 0, angle: 0 });

  useEffect(() => {
    const bird = document.querySelector('.bird');

    // ฟังก์ชันเมื่อกดที่นก
    const handleClick = () => {
      setIsFlying((prevIsFlying) => {
        const newIsFlying = !prevIsFlying;

        if (newIsFlying) {
          bird.classList.add('fly');
        } else {
          bird.classList.remove('fly');
        }

        // บันทึกตำแหน่งปัจจุบันของนกเมื่อถูกคลิก
        const rect = bird.getBoundingClientRect();
        setBirdPosition({ x: rect.x, y: rect.y, angle: 0 });

        return newIsFlying;
      });
    };

    bird.addEventListener('click', handleClick);

    return () => {
      bird.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div
      className="bird"
      style={{
        position: 'absolute',
        left: `${birdPosition.x}px`,
        top: `${birdPosition.y}px`,
        transform: `rotate(${birdPosition.angle}deg)`,
        width: '100px',
        height: '100px',
        backgroundImage: "url('/flying-7288_256.gif')",
        backgroundSize: 'cover',
      }}
    ></div>
  );
};

export default BirdComponent;
