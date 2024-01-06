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

  return (
    <div className='flex items-center justify-center mt-2 0.5xl:hidden lg:flex'>
      <MotionLink 
        href='/' 
        className={
          `${showFullText ? 'w-48 2xl:w-36 px-4 2xl:px-2 text-xxs 2xl:text-xs' : 'w-16 2xl:w-12 text-2xl 2xl:text-xl'} h-16 2xl:h-12 bg-dark text-light ${montserrat.variable} font-montserrat 
          flex items-center justify-center rounded-full font-bold border border-solid border-transparent dark:border-light select-none transition-all ease-in-out`}
        whileHover={{
          backgroundColor: ["#42A5F5", "#29B6F6", "#2196F3", "#1E88E5", "#1976D2", "#1565C0"],
          transition: {duration: 4, repeat: Infinity}
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >{showFullText ? 'SOUNDSCULPT' : 'SS'}</MotionLink>
    </div>
  );
}

export default Logo;