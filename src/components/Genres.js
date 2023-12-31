import React from 'react';
import { motion } from 'framer-motion';

const Genre = ({name, color, x, y}) => {
  return (
    <motion.div 
      className={`flex items-center justify-center rounded-full font-semibold ${color} text-light py-3 px-6 shadow-dark dark:shadow-light cursor-pointer absolute lg:py-2 lg:px-4 md:text-sm md:py-1.5 md:px-3 xs:bg-transparent xs:dark:bg-transparent xs:text-dark xs:dark:text-light xs:font-bold`}
      whileHover={{scale: 1.05}}
      initial={{x: 0, y: 0}}
      whileInView={{ x: x, y: y, transition: {duration: 1} }}
      viewport={{once: true}}
      >{name}
    </motion.div>
  );
}

function Genres() {
  return (
    <>
      <h2 className='font-bold text-8xl mt-64 w-full text-center lg:!text-7xl md:text-6xl md:mt-32 xs:!text-4xl'>Genres</h2>
      <div className='w-full h-screen relative flex items-center justify-center rounded-full bg-circularLight dark:bg-circularDark 
      lg:h-[80vh] sm:h-[60vh] xs:h-[50vh] lg:bg-circularLightLg lg:dark:bg-circularDarkLg md:bg-circularLightMd md:dark:bg-circularDarkMd
      sm:bg-circularLightSm sm:dark:bg-circularDarkSm'>
        <motion.div 
          className='flex items-center justify-center rounded-full font-semibold bg-gray-800 dark:bg-amber-600 text-light px-4 py-8 shadow-dark cursor-pointer lg:p-6 md:p-4 xs:text-xs xs:p-2'
          whileHover={{scale: 1.05}}
        >Genres
        </motion.div>

        <Genre name='Pop' x='-21vw' y='2vw' color='bg-pink-700' />
        <Genre name='Rock' x='-5vw' y='-10vw' color='bg-red-800' />
        <Genre name='Hip-Hop' x='17vw' y='6vw' color='bg-yellow-700' />
        <Genre name='Rap' x='0vw' y='13vw' color='bg-blue-900' />
        <Genre name='Country' x='-21vw' y='-15vw' color='bg-green-700' />
        <Genre name='Jazz' x='23vw' y='-11vw' color='bg-purple-700' />
        <Genre name='Classical' x='35vw' y='-5vw' color='bg-indigo-900' />
        <Genre name='Latin' x='-35vw' y='-5vw' color='bg-red-700' />
        <Genre name='R&B/Soul' x='12vw' y='-20vw' color='bg-blue-800' />
        <Genre name='EDM' x='-25vw' y='17vw' color='bg-purple-600' />
        <Genre name='Indie' x='18vw' y='19vw' color='bg-teal-700' />
      </div>
    </>
  );
}

export default Genres;