import React from 'react';
import { CircularText } from './Icons';
import Link from 'next/link';

function RotatedText() {
  return (
    <div>
      <div className='fixed left-4 bottom-4 flex items-center justify-center overflow-hidden'>
        <div className='w-48 h-auto flex items-center justify-center relative'>
          <CircularText className={'fill-dark animate-spin-slow'} />
          <Link 
            href='mailto:giabaonguyen.workspace@gmail.com' 
            className='flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-dark text-light shadow-md border border-solid border-dark w-20 h-20 rounded-full hover:bg-light hover:text-dark hover:font-bold'>
          Email Me
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RotatedText;