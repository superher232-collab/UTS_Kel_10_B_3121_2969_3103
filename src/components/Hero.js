import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero" id="beranda">
      {/* Logo Box */}
      <div className="hero-logo-box">
        <Image src="/logo.png" alt="PRIMELOG Logo" width={96} height={96} priority />
      </div>

      {/* Title */}
      <h1 className="hero-title">PRIMELOG</h1>

      {/* Subtitle */}
      <p className="hero-subtitle">Fleet Command System</p>

      {/* Gradient Divider */}
      <div className="hero-divider"></div>
    </section>
  );
}
