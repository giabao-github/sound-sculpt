import Layout from '@/components/Layout';
import Uploader from '@/components/Uploader';
import Head from 'next/head';
import { React, useState } from 'react';

function generate() {
  return (
    <>
      <Head>
        <title>SoundSculpt | Generate Music</title>
        <meta name='description' content='' />
      </Head>

      <main>
        <Layout className='pt-16'>
          <Uploader />
        </Layout>
      </main>
    </>
  );
}

export default generate;