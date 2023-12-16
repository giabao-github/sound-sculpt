import { React, useState } from 'react';
import Layout from './Layout';
import Link from 'next/link';

function Footer() {
  const [isHovered, setIsHovered] = useState(false);
  const [isLinkHovered, setIsLinkHovered] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  return (
    <footer className='w-full border-t-2 border-solid border-dark font-medium text-lg'>
      <Layout className='py-8 flex items-center justify-between'>
        <span>{new Date().getFullYear()} &copy; All Rights Reserved.</span>
        <div className='flex items-center'>
          Build with 
          <span 
            className='text-primary text-2xl px-1 cursor-pointer'
            onClick={() => { 
              if (!isFilled) setIsFilled(true) 
              else setIsFilled(false) 
            }}
          >{isFilled ? String.fromCharCode(9829) : String.fromCharCode(9825)}</span> by&nbsp;
          <Link href='https://www.facebook.com/profile.php?id=100046206394356&locale=vi_VN' 
            className={`${isHovered ? 'text-green-600 font-semibold' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >me</Link>
        </div>
        <Link href='/' 
          className={`${isLinkHovered ? 'text-primary' : ''}`}
            onMouseEnter={() => setIsLinkHovered(true)}
            onMouseLeave={() => setIsLinkHovered(false)}
          >SoundSculpt</Link>
      </Layout>
    </footer>
  );
}

export default Footer;