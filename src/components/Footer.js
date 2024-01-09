import { React, useState } from 'react';
import Layout from './Layout';
import Link from 'next/link';
import { FaRegHeart, FaHeart, FaCircleUp } from "react-icons/fa6";

function Footer() {
  const [isHovered, setIsHovered] = useState(false);
  const [isLinkHovered, setIsLinkHovered] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  return (
    <footer className='w-full border-t-2 border-solid border-dark font-medium text-lg xs:!text-sm xxs:!text-[0.7rem] dark:text-light dark:border-light sm:text-base'>
      <Layout 
        className='py-8 flex items-center justify-between lg:flex-col 2xl:!py-8 1.75xl:!py-8 1.5xl:!py-8 1.25xl:!py-7 xl:!py-7 0.75xl:!py-7 0.5xl:!py-6 0.25xl:!py-6 lg:!py-6 md:!py-5 sm:!py-5 xs:!py-5'
      >
        <span>{new Date().getFullYear()} &copy; All Rights Reserved.</span>
        <div className='flex items-center select-none lg:py-2'>
          Build with&nbsp;
          {
            isFilled ? 
            <FaRegHeart
              className={`text-primary dark:text-primaryDark text-2xl xs:!text-xl px-1 cursor-pointer`}
              onClick={() => { 
                if (!isFilled) {
                  setIsFilled(true)
                } else {
                  setIsFilled(false)
                } 
              }}
            /> :
            <FaHeart
              className={`text-primary dark:text-primaryDark text-2xl xs:!text-xl px-1 cursor-pointer`}
              onClick={() => { 
                if (!isFilled) {
                  setIsFilled(true)
                } else {
                  setIsFilled(false)
                } 
              }}
            />
          }&nbsp;by&nbsp;
          <Link href='https://www.facebook.com/profile.php?id=100046206394356&locale=vi_VN' 
            className={`${isHovered ? 'text-green-600 font-semibold' : ''}`}
            target='_blank'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >me</Link>
        </div>
        <Link 
          href='/' title='Head to top'
          className={`${isLinkHovered ? 'text-primary dark:text-primaryDark' : ''}`}
          onMouseEnter={() => setIsLinkHovered(true)}
          onMouseLeave={() => setIsLinkHovered(false)}
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <FaCircleUp className='text-3xl xs:!text-2xl xxs:!text-xl' />
        </Link>
      </Layout>
    </footer>
  );
}

export default Footer;