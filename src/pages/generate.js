import Layout from '@/components/Layout';
import TransitionEffect from '@/components/TransitionEffect';
import Uploader from '@/components/Uploader';
import Head from 'next/head';
import { React } from 'react';

function Generate() {
  return (
    <>
      <Head>
        <title>SoundSculpt | Generate Music</title>
        <meta name='description' content='' />
      </Head>
      <TransitionEffect />
      <main className=''>
        <Layout className='pt-16'>
          <Uploader />
        </Layout>
      </main>
    </>
  );
}

export default Generate;