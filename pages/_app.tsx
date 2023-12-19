import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Bored Game by Bored Dev</title>
        <link rel="icon" href="/favicon.ico?v=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
