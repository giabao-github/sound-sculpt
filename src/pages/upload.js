import Layout from '@/components/Layout';
import Uploader from '@/components/Uploader';
import Uploader from '@/components/Uploader';
import Head from 'next/head';
import React from 'react';

function upload() {
  return (
    <>
      <Head>
        <title>SoundSculpt | Upload Files</title>
        <meta name='description' content='' />
      </Head>

      <main className='w-full flex flex-col items-center justify-center'>
        <Layout className='pt-16'>
          <Uploader />
        </Layout>
      </main>
    </>
  );
}

export default upload;