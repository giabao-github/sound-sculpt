import Link from 'next/link';
import { React, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Montserrat } from 'next/font/google';

const MotionLink = motion(Link);

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: ['--font-mont'],
});

function Logo() {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1460) {
        setIsHovered(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const showFullText = isHovered && (window.innerWidth > 1460 || window.innerWidth <= 1024);
  const text = showFullText ? 'SOUNDSCULPT' : 'SS';

  return (
    <div className='flex items-center justify-center mt-2 0.5xl:hidden lg:flex'>
      <MotionLink 
        href='/' 
        className={
          `${showFullText ? 'w-40 2xl:w-36 px-2 text-sm 2xl:text-xs' : 'w-14 2xl:w-12 text-xl 2xl:text-lg'} h-14 2xl:h-12 bg-dark 
          text-light ${montserrat.variable} font-montserrat flex items-center justify-center rounded-full font-bold border border-solid border-transparent dark:border-light select-none transition-all ease-in-out`}
        whileHover={{
          backgroundColor: ["#42A5F5", "#29B6F6", "#2196F3", "#1E88E5", "#1976D2", "#1565C0", "#1976D2", "#1E88E5", "#2196F3", "#29B6F6"],
          transition: {duration: 8, repeat: Infinity}
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {text.split('').map((char, i) => (
          <span
            key={i}
            style={{
              display: 'inline-block',
              animation: isHovered ? `wave 0.5s ease ${i / 22}s 1 normal` : '',
            }}
          >
            {char}
          </span>
        ))}
      </MotionLink>
      <style jsx>{`
        @keyframes wave {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Logo;