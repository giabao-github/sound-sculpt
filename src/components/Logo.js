import Link from 'next/link';
import { React, useState } from 'react';
import { motion } from 'framer-motion';
import { Bungee_Spice, Montserrat } from 'next/font/google';

const MotionLink = motion(Link);

const bungee = Bungee_Spice({
  subsets: ['latin'],
  variable: ['--font-bungee'],
  weight: ['400'],
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: ['--font-mont'],
});

function Logo() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className='flex items-center justify-center mt-2'>
      <MotionLink 
        href='/' 
        className={
          `${isHovered ? 'w-48' : 'w-16'} h-16 ${isHovered ? 'px-4' : ''} bg-dark text-light ${montserrat.variable} font-montserrat flex items-center justify-center 
          rounded-full ${isHovered ? 'text-xxs' : 'text-2xl'} font-bold select-none transition-all duration-500 ease-in-out`}
        whileHover={{
          backgroundColor: ["#42A5F5", "#29B6F6", "#2196F3", "#1E88E5", "#1976D2", "#1565C0"],
          transition: {duration: 4, repeat: Infinity}
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >{isHovered ? 'SOUNDSCULPT' : 'SS'}</MotionLink>
    </div>
  );
}

export default Logo;