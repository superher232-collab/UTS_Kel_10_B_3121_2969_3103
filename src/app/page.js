import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Features from "@/components/Features";
import Advantages from "@/components/Advantages";
import Gallery from "@/components/Gallery";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

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
      {/* Ambient Orbs */}
      <div className="ambient-orbs" aria-hidden="true">
        <div className="orb orb--1"></div>
        <div className="orb orb--2"></div>
      </div>

      {/* Hero Background Image */}
      <div className="hero-bg" style={{
        width: '100%',
        height: '100vh',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0
      }}>
        <img src="/hero-bg.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
          <CTA />
        </div>
        <Footer />
      </main>
    </div>
  );
}