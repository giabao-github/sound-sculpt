import AnimatedText from '@/components/AnimatedText';
import Layout from '@/components/Layout';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import article1 from '../../public/images/articles/simple and controllable music generation.png';
import article2 from '../../public/images/articles/can musicgen create training data for mir tasks.png';
import article3 from '../../public/images/articles/equipping musicgen with chord and rhythm controls.png';
import article4 from '../../public/images/articles/muspy - a toolkit for symbolic music generation.png';
import article5 from '../../public/images/articles/incorporating music knowledge in continual dataset augmentation for music generation.png';
import article6 from '../../public/images/articles/nonoto - a model-agnostic web interface for interactive music composition by inpainting.png';
import article7 from '../../public/images/articles/transfer learning for underrepresented music generation.png';

const FramerImage = motion(Image);

const MovingImage = ({title, image, link}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const imageRef = useRef(null);

  const handleMouse = (event) => {
    imageRef.current.style.display = 'inline-block';
    x.set(event.pageX);
    y.set(-10);
  }

  const handleMouseLeave = (event) => {
    imageRef.current.style.display = 'none';
    x.set(0);
    y.set(0);
  }

  return (
    <Link 
      href={link} target='_blank'
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
    >
      <h2 className='capitalize text-xl font-semibold hover:underline'>{title}</h2>
      <FramerImage 
        ref={imageRef} src={image} alt={title}
        style={{ x: x, y: y }}
        initial={{opacity: 0}}
        whileInView={{opacity: 1, transition: {duration: 0.2}}}
        className='w-52 z-10 h-auto hidden absolute rounded-lg' 
      />
    </Link>
  );
}

const Article = ({image, title, date, link}) => {
  return (
    <motion.li 
      initial={{y: 200}}
      whileInView={{y: 0, transition: {duration: 0.5, ease: 'easeInOut'}}}
      viewport={{once: true}}
      className='relative w-full px-4 py-6 my-4 rounded-xl flex items-center justify-between bg-light dark:bg-dark text-dark dark:text-light first:mt-0 border border-solid border-dark dark:border-light border-r-4 border-b-4'>
      <MovingImage title={title} image={image} link={link} />
      <span className='text-primary dark:text-primaryDark pl-4'>{date}</span>
    </motion.li>
  );
}

const FeaturedArticle = ({image, title, time, summary, link}) => {
  return(
    <li className='relative col-span-1 w-full p-4 bg-light dark:bg-dark border border-solid border-dark dark:border-light rounded-2xl'>
      <div className='absolute top-0 -right-[0.75vw] -z-10 w-[39.6vw] h-[120.5vh] rounded-[2rem] bg-dark dark:bg-light rounded-br-3xl' />
      <Link
        href={link}
        target='_blank'
        className='w-full inline-block cursor-pointer overflow-hidden rounded-lg'
      >
        <FramerImage 
          src={image} alt={title} className='w-full h-auto rounded-md'
          whileHover={{scale: 1.05}}
          transition={{duration: 0.2}}
          priority sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw'
        />
      </Link>
      <Link href={link} target='_blank'>
        <h2 className='capitalize text-2xl font-bold my-2 mt-4 hover:underline'>{title}</h2>
      </Link>
      <p className='text-sm mb-2'>{summary}</p>
      <span className='text-primary dark:text-primaryDark text-xs'>{time}</span>
    </li>
  );
}

function articles() {
  return (
    <>
      <Head>
        <title>SoundSculpt | Articles Page</title>
        <meta name='description' content='' />
      </Head>
      <main className='w-full mb-16 flex flex-col items-center justify-center overflow-hidden'>
        <Layout className='pt-16'>
          <AnimatedText text='Words Can Change The World!' className='mb-16' />
          <ul className='grid grid-cols-2 gap-16 dark:text-light'>
            <FeaturedArticle
              title='Simple and Controllable Music Generation'
              summary='MUSICGEN, a single-stage transformer Language Model (LM), is introduced for conditional music generation, eliminating the need for cascading models. It can generate high-quality mono and stereo samples conditioned on textual description or melodic features. Extensive evaluations show its superiority over baselines on a standard text-to-music benchmark.'
              time='90 minutes read'
              link='https://arxiv.org/pdf/2306.05284.pdf'
              image={article1}
            />
            <FeaturedArticle
              title='Can MusicGen Create Training Data for MIR Tasks?'
              summary='The researchers are using AI-based generative music systems, specifically MusicGen, to generate training data for Music Information Retrieval tasks. They trained a genre classifier on an artificial music dataset, created with over 50,000 genre-conditioned textual descriptions and music excerpts covering five genres. Preliminary results show the model can learn genre-specific characteristics from artificial music that generalize well to real-world music.'
              time='20 minutes read'
              link='https://arxiv.org/pdf/2311.09094.pdf'
              image={article2}
            />
          </ul>
          <h2 className='font-bold text-4xl w-full text-center my-16 mt-32 dark:text-light'>All Articles</h2>
          <ul className='pb-7'>
            <Article
              title='Equipping MusicGen with Chord and Rhythm Controls'
              date='November 9, 2023'
              link='https://www.researchgate.net/profile/Yixiao-Zhang-12/publication/375670127_Equipping_MusicGen_with_Chord_and_Rhythm_Controls/links/65559968b1398a779d9089d0/Equipping-MusicGen-with-Chord-and-Rhythm-Controls.pdf'
              image={article3}
            />
            <Article
              title='Transfer Learning for Underrepresented Music Generation'
              date='June 1, 2023'
              link='https://arxiv.org/pdf/2306.00281.pdf'
              image={article7}
            />
            <Article
              title='MusPy: A Toolkit for Symbolic Music Generation'
              date='August 5, 2020'
              link='https://arxiv.org/pdf/2008.01951.pdf'
              image={article4}
            />
            <Article
              title='Incorporating Music Knowledge in Continual Dataset Augmentation for Music Generation'
              date='July 20, 2020'
              link='https://arxiv.org/pdf/2006.13331.pdf'
              image={article5}
            />
            <Article
              title='NONOTO: A Model-agnostic Web Interface for Interactive Music Composition by Inpainting'
              date='July 23, 2019'
              link='https://arxiv.org/pdf/1907.10380.pdf'
              image={article6}
            />
            
          </ul>
        </Layout>
      </main>
    </>
  );
}

export default articles;