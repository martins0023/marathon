import type { AppProps } from 'next/app';
import '../styles/globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// The next/font/google imports are no longer needed here.
// The font handling is now managed by Tailwind CSS via globals.css.
// import { Inter, Orelega_One } from 'next/font/google';

// The following line is also not needed.
// const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    // We've removed the font class from the root div to rely on the body font
    // set in the globals.css file, which is the recommended approach.
    <div className="bg-white">
      {/* The Navbar is now a fixed component that sits at the top of the screen */}
      <Navbar />
      <main>
        {/*
          Removing py-6 from the main tag. Individual sections will handle their
          own top padding to avoid a large gap between the navbar and the hero section.
        */}
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}
