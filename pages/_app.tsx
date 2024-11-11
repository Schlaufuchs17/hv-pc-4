import type { AppProps } from 'next/app';
import '../src/client/styles/style.css';  
import '../src/client/styles/globals.css';

function ChatNext({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default ChatNext;
