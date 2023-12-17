import { Provider } from 'react-redux';
import store from '@/components/store';

import { Inter } from 'next/font/google';
import Game from '../components/game';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <Provider store={store}>
      <Game />
    </Provider>
  );
}
