import React, { useRef, useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import DevelopementIcons from './DevelopementIcons';
import Link from 'next/link';

const Details = ({development, subject, link, time, description}) => {
  const ref = useRef(null);
  return (
    <li ref={ref} className='my-8 first:mt-0 last:mb-0 w-[60%] md:w-[80%] mx-auto flex flex-col items-center justify-between'>
      <DevelopementIcons reference={ref} />
      <motion.div
        initial={{ y: 50 }}
        whileInView={{ y: 0 }}
        transition={{ duration: 0.5, type: 'spring' }}>
        <h3 className='font-bold text-2xl sm:text-xl xs:text-lg'>
          {development}&nbsp;
          <a href={link} target='_blank' className='text-primary dark:text-primaryDark capitalize'>{subject}</a>
        </h3>
        <span className='capitalize font-medium text-dark/75 dark:text-light/75 xs:text-sm'>
          {time}
        </span>
        <p className='font-medium w-full md:text-sm'>
          {description}
        </p>
      </motion.div>
    </li>
  );
}

function Development() {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const { scrollYProgress } = useScroll(
    {
      target: ref,
      offset: ["start end", "center end"]
    }
  );

  return (
    <div className='my-64 md:my-32'>
      <h2 className='font-bold text-8xl mt-16 mb-32 w-full text-center lg:!text-7xl sm:!text-6xl xs:!text-4xl xs:mt-4 xs:mb-16'>About MusicGen</h2>
      
      <div ref={ref} className='w-[75%] lg:w-[90%] md:w-full mx-auto relative'>
        <motion.div 
          style={{scaleY: scrollYProgress}} 
          className={`absolute left-7 md:left-[30px] top-[2px] w-[4px] md:w-[2px] h-full bg-dark dark:bg-light origin-top xs:hidden`}
        />
        <ul className='w-full flex flex-col items-start justify-between ml-4 xs:ml-2'>
          <Details
            development='Introduced and submitted to' subject='ArXiv' link='https://arxiv.org' time='June 8, 2023' description='MusicGen was introduced by Jade Copet, Felix Kreuk, Itai Gat, Tal Remez, David Kant, Gabriel Synnaeve, Yossi Adi, and Alexandre Défossez. The model was submitted to arXiv, an open-access repository of electronic preprints and postprints, on June 8, 2023.'
          />
          <Details
            development='Unveiled by' subject='Meta' link='https://www.facebook.com/MetaVietnam' time='June 19, 2023' description='MusicGen was designed to facilitate the creation of all-new music. It utilizes text or melody prompts to generate unique tracks based on a vast database of samples and instrument styles.'
          />
          <Details
            development='Submitted as revised version to' subject='ArXiv' link='https://arxiv.org' time='November 7, 2023' description='In the revised version, MusicGen is described as a single Language Model (LM) that operates over several streams of compressed discrete music representation (i.e. tokens). Unlike prior work, MusicGen is comprised of a single-stage transformer LM together with efficient token interleaving patterns. This eliminates the need for cascading several models.'
          />
          <Details
            development='Released by' subject='Meta' link='https://www.facebook.com/MetaVietnam' time='November 15, 2023' 
            description={
              <>
                {'MusicGen is a single-stage auto-regressive Transformer model that is capable of generating high-quality music samples conditioned on text descriptions or audio prompts. It was released as part of '} 
                <Link 
                  className={`${isHovered ? 'text-green-600' : ''}`} 
                  href='https://github.com/facebookresearch/audiocraft'
                  target='_blank'
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >AudioCraft</Link>
                {', a single-stop code base for all generative audio needs: music, sound effects, and compression after training on raw audio signals.'}
              </>
            }
          />
        </ul>
      </div>
    </div>
  );
}

export default Development;