import Link from 'next/link';
import { React, useEffect, useState } from 'react';
import Logo from './Logo';
import { useRouter } from 'next/router';
import { TwitterIcon, GithubIcon, LinkedInIcon, PinterestIcon, DribbbleIcon, SunIcon, MoonIcon } from './Icons';
import { motion } from 'framer-motion';
import useThemeSwitcher from './hooks/useThemeSwitcher';

const CustomLink = ({ href, title, className='' }) => {
  const router = useRouter();

  return (
    <Link href={href} className={`${className} relative group`}>
      {title}
      <span className={
        `h-[2px] inline-block bg-dark dark:bg-light absolute left-1/2 -bottom-0.5 transform -translate-x-1/2 group-hover:w-full 
        transition-[width] ease duration-300 ${router.asPath === href ? 'w-full' : 'w-0'}`
      }>
        &nbsp;
      </span>
    </Link>
  )
};

const CustomLinkMobile = ({ href, title, className='', toggle }) => {
  const router = useRouter();

  const handleClick = () => {
    toggle();
    router.push(href)
  }

  return (
    <button href={href} className={`${className} relative group text-light dark:text-dark my-2`} onClick={handleClick}>
      {title}
      <span className={
        `h-[2px] inline-block bg-light dark:bg-dark absolute left-1/2 -bottom-0.5 transform -translate-x-1/2 group-hover:w-full 
        transition-[width] ease duration-300 ${router.asPath === href ? 'w-full' : 'w-0'}`
      }>
        &nbsp;
      </span>
    </button>
  )
};

function Navbar() {
  const [mode, setMode] = useThemeSwitcher();
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  const handleClick = () => {
    setIsMenuOpened(!isMenuOpened);
  }

  useEffect(() => {
    console.log(window.innerWidth);
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpened(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header 
      className='bg-light dark:bg-dark w-full px-32 xl:px-16 lg:px-16 md:px-12 sm:px-8 py-2 xl:py-2 0.5xl:py-6 lg:py-2 font-medium flex 
      items-center justify-between relative z-10 border-b-2 border-solid border-dark dark:border-light dark:text-light'>
      <button className='flex-col justify-center items-center hidden lg:flex' onClick={handleClick}>
        <span className={`bg-dark dark:bg-light block transition-all duration-100 ease-out h-0.5 w-6 rounded-sm ${isMenuOpened ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
        <span className={`bg-dark dark:bg-light block transition-all duration-100 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isMenuOpened ? 'opacity-0' : 'opacity-100'}`}></span>
        <span className={`bg-dark dark:bg-light block transition-all duration-100 ease-out h-0.5 w-6 rounded-sm ${isMenuOpened ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
      </button>
      
      <div className='w-full flex justify-between items-center'>
        <nav className='lg:hidden'>
          <CustomLink href='/' title="Home" className='mr-4'/>
          <CustomLink href='/about' title="About" className='mx-4' />
          <CustomLink href='/generate' title="Generate Music" className='mx-4' />
          <CustomLink href='/articles' title="Articles" className='ml-4' />
        </nav>
        <div className='flex items-center justify-center relative  lg:left-1/2 transform lg:-translate-x-1/2 -translate-y-1 lg:pr-4 xs:pr-5'>
            <Logo />
        </div>
        <nav className='flex items-center justify-center flex-wrap lg:hidden'>
          <motion.a href='https://twitter.com/Cendryss' title='Twitter' target={'_blank'} className='w-6 mr-3' whileHover={{y: -2}} whileTap={{scale: 0.9}}>
            <TwitterIcon />
          </motion.a>
          <motion.a href='https://github.com/giabao-github' title='GitHub' target={'_blank'} className='w-6 mx-3' whileHover={{y: -2}} whileTap={{scale: 0.9}}>
            <GithubIcon />
          </motion.a>
          <motion.a href='https://www.linkedin.com/in/b%E1%BA%A3o-nguy%E1%BB%85n-6ab64929a' title='LinkedIn' target={'_blank'} className='w-6 mx-3' whileHover={{y: -2}} whileTap={{scale: 0.9}}>
            <LinkedInIcon />
          </motion.a>
          <motion.a href='https://www.pinterest.com/giabaonguyenworkspace/' title='Pinterest' target={'_blank'} className='w-6 mx-3 bg-light rounded-full' whileHover={{y: -2}} whileTap={{scale: 0.9}}>
            <PinterestIcon />
          </motion.a>
          <motion.a href='https://dribbble.com/' title='Dribbble' target={'_blank'} className='w-6 mx-3' whileHover={{y: -2}} whileTap={{scale: 0.9}}>
            <DribbbleIcon />
          </motion.a>

          <button
            title={`${mode === 'dark'   ? 'Dark Mode: On' : 'Dark Mode: Off'}`}
            onClick={() => setMode(mode === 'light' ?  'dark' : 'light')}
            className={`ml-3 flex items-center justify-center rounded-full p-1 ${mode === 'light' ? 'bg-dark text-light' : 'bg-light text-dark'}`}
          >
            {
              mode === 'dark' ?
              <SunIcon className={'fill-dark'} /> : <MoonIcon className={'fill-dark'} />
            }
          </button>
        </nav>
      </div>

      {
        isMenuOpened ?
        <motion.div
          initial={{ scale: 0, opacity: 0, x: '-50%', y: '-50%' }}
          animate={{ scale: 1, opacity: 1 }}
          className='min-w-[70vw] flex flex-col justify-between items-center fixed z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-dark/75 dark:bg-light/75 rounded-lg backdrop-blur-md py-16'>
          <nav className='flex flex-col justify-center items-center'>
            <CustomLinkMobile href='/' title="Home" className='' toggle={handleClick} />
            <CustomLinkMobile href='/about' title="About" className='' toggle={handleClick} />
            <CustomLinkMobile href='/generate' title="Generate Music" className='' toggle={handleClick} />
            <CustomLinkMobile href='/articles' title="Articles" className='' toggle={handleClick} />
          </nav>
          <nav className='flex items-center justify-center flex-wrap mt-5 mb-3'>
            <motion.a 
              href='https://twitter.com/Cendryss' title='Twitter' target={'_blank'} 
              className='w-6 mr-3 sm:mx-1' 
              whileHover={{y: -2}} whileTap={{scale: 0.9}}>
              <TwitterIcon />
            </motion.a>
            <motion.a 
              href='https://github.com/giabao-github' title='GitHub' target={'_blank'} 
              className='w-6 mx-3 bg-light dark:bg-dark rounded-full sm:mx-1' 
              whileHover={{y: -2}} whileTap={{scale: 0.9}}>
              <GithubIcon />
            </motion.a>
            <motion.a 
              href='https://www.linkedin.com/in/b%E1%BA%A3o-nguy%E1%BB%85n-6ab64929a' title='LinkedIn' target={'_blank'} 
              className='w-6 mx-3 sm:mx-1' 
              whileHover={{y: -2}} whileTap={{scale: 0.9}}>
              <LinkedInIcon />
            </motion.a>
            <motion.a 
              href='https://www.pinterest.com/giabaonguyenworkspace/' title='Pinterest' target={'_blank'} 
              className='w-6 mx-3 bg-light rounded-full sm:mx-1' 
              whileHover={{y: -2}} whileTap={{scale: 0.9}}>
              <PinterestIcon />
            </motion.a>
            <motion.a 
              href='https://dribbble.com/' title='Dribbble' target={'_blank'} 
              className='w-6 mx-3 sm:mx-1' 
              whileHover={{y: -2}} whileTap={{scale: 0.9}}>
              <DribbbleIcon />
            </motion.a>

            <button
              title={`${mode === 'dark'   ? 'Dark Mode: On' : 'Dark Mode: Off'}`}
              onClick={() => setMode(mode === 'light' ?  'dark' : 'light')}
              className={`ml-3 flex items-center justify-center rounded-full p-1 ${mode === 'light' ? 'bg-dark text-light' : 'bg-light text-dark'}`}
            >
              {
                mode === 'dark' ?
                <SunIcon className={'fill-dark'} /> : <MoonIcon className={'fill-dark'} />
              }
            </button>
          </nav>
        </motion.div>
        : null
      }
    </header>
  );  
}

export default Navbar;