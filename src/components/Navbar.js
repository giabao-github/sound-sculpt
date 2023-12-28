import Link from 'next/link';
import React from 'react';
import Logo from './Logo';
import { useRouter } from 'next/router';
import { TwitterIcon, GithubIcon, LinkedInIcon, PinterestIcon, DribbbleIcon, SunIcon, MoonIcon } from './Icons';
import { motion } from 'framer-motion';
import useThemeSwitcher from './hooks/useThemeSwitcher';

const CustomLink = ({href, title, className=''}) => {
  const router = useRouter();

  return (
    <Link href={href} className={`${className} relative group`}>
      {title}
      <span className={
        `h-[2px] inline-block bg-dark absolute left-1/2 -bottom-0.5 transform -translate-x-1/2 group-hover:w-full 
        transition-[width] ease duration-300 ${router.asPath === href ? 'w-full' : 'w-0'} dark:bg-light`
      }>
        &nbsp;
      </span>
    </Link>
  )
}

function Navbar() {
  const [mode, setMode] = useThemeSwitcher();

  return (
    <header 
      className='bg-light dark:bg-dark w-full px-32 py-8 font-medium flex items-center justify-between sticky top-0 z-50 border-b-2 
      border-solid border-dark dark:border-light dark:text-light'>
      <nav>
        <CustomLink href='/' title="Home" className='mr-4'/>
        <CustomLink href='/about' title="About" className='mx-4' />
        <CustomLink href='/generate' title="Generate Music" className='mx-4' />
        <CustomLink href='/articles' title="Articles" className='ml-4' />
      </nav>

      <nav className='flex items-center justify-center flex-wrap'>
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

      <div className='absolute left-[50%] top-2 translate-x-[-50%]'>
        <Logo />
      </div>
    </header>
  );  
}

export default Navbar;