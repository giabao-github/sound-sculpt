import Head from 'next/head';
import AnimatedText from '@/components/AnimatedText';
import Development from '@/components/Development';
import Genres from '@/components/Genres';
import Layout from '@/components/Layout';
import { useInView, useMotionValue, useSpring } from 'framer-motion';
import { React, useEffect, useRef } from 'react';
import illustration from '../../public/images/arts/illustration.png';
import Image from 'next/image';
import TransitionEffect from '@/components/TransitionEffect';

const AnimatedNumbers = ({value}) => {
  const ref = useRef(null);

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 3000 });
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue])

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current && latest.toFixed(0) <= value) {
        ref.current.textContent = latest.toFixed(0);
      }
    })
  }, [springValue, value])

  return <span ref={ref}></span>
}

function About() {
  return (
    <>
      <Head>
        <title>SoundSculpt | About</title>
        <meta name='description' content='' />
      </Head>
      <TransitionEffect />
      <main className='flex w-full flex-col items-center justify-center dark:text-light'>
        <Layout className='pt-16'>
          <AnimatedText text='A magical music tool!' className='mt-8 mb-16 lg:!text-7xl sm:!text-6xl sm:!mb-8 xs:!text-4xl' />
          <div className='grid w-full grid-cols-8 gap-16 sm:gap-8'>
            <div className='col-span-3 xl:col-span-4 md:order-2 md:col-span-8 flex flex-col items-start justify-start'>
              <h2 className='mb-4 text-xl font-bold uppercase text-dark/75 dark:text-light/75'>Introduction</h2>
              <p className='font-medium text-xl md:text-base'>
              Welcome to our unique music transformation platform! Here, we breathe life into your musical ideas by transforming your audio files based on your descriptions. Whether it is pop, rock, or jazz, played with guitar or light drums, we have got you covered.
              </p>
              <p className='my-4 font-medium text-xl md:text-base'>
              Our tool is designed with simplicity and efficiency in mind. All you need to do is upload your audio file, provide a description of your desired style, and let our tool do the magic. It is as simple as that!
              </p>
              <p className='font-medium text-xl md:text-base'>
              Experience the joy of creating music like never before. With our platform, you are not just a listener, but an active participant in the music creation process. Join us and let us make music together!
              </p>
            </div>
            <div className='col-span-3 xl:col-span-4 md:order-1 md:col-span-8 relative h-max rounded-2xl border-2 border-solid border-dark bg-light dark:bg-dark dark:border-light p-8'>
              <div className='absolute top-0 -right-3 -z-10 w-[103%] h-[103%] lg:w-[103.5%] lg:h-[103.5%] xs:-top-[2px] xs:-right-2 xs:w-[103.5%] 
              xs:h-[103.5%] xs:rounded-[1.5rem] rounded-[2rem] bg-dark dark:bg-light' />
              <Image 
                src={illustration} alt='' className='w-full h-auto rounded-2xl' 
                priority sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' 
              />
            </div>

            <div className='col-span-2 xl:col-span-8 xl:flex-row xl:items-center md:order-3 flex flex-col items-end justify-between'>
              <div className='flex flex-col items-end justify-center xl:items-center'>
                <span className='inline-block text-7xl font-bold md:text-6xl sm:text-5xl xs:text-4xl'>
                  <AnimatedNumbers value={50} />+
                </span>
                <h2 
                  className='text-xl font-medium capitalize text-dark/75 dark:text-light/75 2xl:text-[1.2rem] 1.75xl:text-[1.15rem] 
                  1.5xl:text-[1.1rem] 1.25xl:text-[1rem] xl:text-center md:text-lg sm:text-base xs:text-sm'
                >positive feedback</h2>
              </div>
              <div className='flex flex-col items-end justify-center xl:items-center'>
                <span className='inline-block text-7xl font-bold md:text-6xl sm:text-5xl xs:text-4xl'>
                  <AnimatedNumbers value={100} />+
                </span>
                <h2 
                  className='text-xl font-medium capitalize text-dark/75 dark:text-light/75 2xl:text-[1.2rem] 1.75xl:text-[1.15rem] 
                  1.5xl:text-[1.1rem] 1.25xl:text-[1rem] xl:text-center md:text-lg sm:text-base xs:text-sm'
                >files converted</h2>
              </div>
            </div>
          </div>
        </Layout>
        <Genres />
        <Development />
      </main>
    </>
  );
}

export default About;