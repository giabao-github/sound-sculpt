import React from 'react';

function Layout({children, className=''}) {
  return (
    <div 
      className={`w-full h-full inline-block z-0 bg-light dark:bg-dark p-32 2xl:!p-[7.5rem] 1.75xl:!p-28 1.5xl:!p-[6.5rem] 
      1.25xl:!p-24 xl:!p-[5.5rem] 0.75xl:!p-20 0.5xl:!p-[4.5rem] 0.25xl:!p-16 lg:!p-14 md:!p-12 sm:!p-10 xs:!p-8 ${className}`}>
      {children}
    </div>
  );
}

export default Layout;