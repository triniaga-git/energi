import styles from './WaveAnimation.module.css';

export default function WaveAnimation({ height = 120, className = '' }) {
  return (
    <div className={`${styles.waveContainer} ${className}`} style={{ height }}>
      <div className={`${styles.wave} ${styles.wave1}`}>
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 C1680,120 1920,0 2160,60 C2400,120 2640,0 2880,60 L2880,120 L0,120 Z"
            fill="url(#waveGrad1)"
          />
          <defs>
            <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0, 145, 204, 0.3)" />
              <stop offset="50%" stopColor="rgba(0, 99, 153, 0.4)" />
              <stop offset="100%" stopColor="rgba(0, 145, 204, 0.3)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className={`${styles.wave} ${styles.wave2}`}>
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,80 C320,20 640,100 960,40 C1280,100 1600,20 1920,80 C2240,20 2560,100 2880,40 L2880,120 L0,120 Z"
            fill="url(#waveGrad2)"
          />
          <defs>
            <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0, 51, 102, 0.25)" />
              <stop offset="50%" stopColor="rgba(0, 122, 179, 0.3)" />
              <stop offset="100%" stopColor="rgba(0, 51, 102, 0.25)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className={`${styles.wave} ${styles.wave3}`}>
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,40 C360,100 720,20 1080,80 C1440,20 1800,100 2160,40 C2520,100 2880,20 3240,80 L3240,120 L0,120 Z"
            fill="url(#waveGrad3)"
          />
          <defs>
            <linearGradient id="waveGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0, 77, 128, 0.15)" />
              <stop offset="50%" stopColor="rgba(0, 145, 204, 0.2)" />
              <stop offset="100%" stopColor="rgba(0, 77, 128, 0.15)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {/* Foam particles */}
      <div className={styles.foam}>
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            className={styles.foamDot}
            style={{
              left: `${15 + i * 14}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
