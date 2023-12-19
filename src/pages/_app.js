import '@/styles/globals.css';
import { Inter, Montserrat } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Head from 'next/head';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: ['--font-inter']
});

const mont = Montserrat({
  subsets: ['latin'],
  variable: ['--font-mont']
});

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${mont.variable} font-mont bg-light dark:bg-dark w-full min-h-screen`}>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </main>
    </>
  );
}
