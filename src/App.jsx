import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
import About from './components/About';
import Quote from './components/Quote';
import Services from './components/Services';
import Clients from './components/Clients';
import Experience from './components/Experience';
import Engagements from './components/Engagements';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Footer from './components/Footer';
import usePageEffects from './hooks/usePageEffects';

export default function App() {
  usePageEffects();

  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <Stats />
        <About />
        <Quote />
        <Services />
        <Clients />
        <Experience />
        <Engagements />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
