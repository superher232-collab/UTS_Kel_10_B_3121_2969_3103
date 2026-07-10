import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Features from "@/components/Features";
import Advantages from "@/components/Advantages";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export const metadata = {
  title: 'PRIMELOG — Fleet Command System | Maritime Fleet Management',
  description: 'PRIMELOG is a next-generation fleet command system for real-time vessel tracking, cargo management, and maritime operational optimization across Indonesian waters.'
}

export default function Home() {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      margin: 0,
      padding: 0,
      overflowX: 'hidden',
      background: '#07020E',
      position: 'relative'
    }}>
      {/* Scroll Progress */}
      <div className="scroll-progress" id="scroll-progress" aria-hidden="true" />

      {/* Atmosphere */}
      <div className="atmosphere" aria-hidden="true" />

      {/* Ambient Orbs */}
      <div className="ambient-orbs" aria-hidden="true">
        <div className="orb orb--1"></div>
        <div className="orb orb--2"></div>
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Hero />
        <div style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1024px',
          margin: '0 auto',
          padding: '0 24px 80px',
          display: 'flex',
          flexDirection: 'column',
          gap: '48px',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <About />
          <Features />
          <Advantages />
          <Gallery />
          <Testimonials />
          <Contact />
          <CTA />
        </div>
        <Footer />
      </main>

      {/* Scroll Progress Script */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          var bar = document.getElementById('scroll-progress');
          if (!bar) return;
          function update() {
            var h = document.documentElement;
            var pct = h.scrollTop / (h.scrollHeight - h.clientHeight);
            bar.style.transform = 'scaleX(' + pct + ')';
          }
          window.addEventListener('scroll', update, { passive: true });
          update();
        })();
      `}} />
    </div>
  );
}