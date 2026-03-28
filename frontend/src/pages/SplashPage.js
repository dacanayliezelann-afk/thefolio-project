// frontend/src/pages/SplashPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from '../pictures/chefgirl.avif';

function SplashPage() {
  const [dots,     setDots]     = useState('');
  const [isFading, setIsFading] = useState(false);
  const [visible,  setVisible]  = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('splash-active');

    // Trigger entrance animation
    requestAnimationFrame(() => setTimeout(() => setVisible(true), 50));

    const dotInterval = setInterval(() => {
      setDots(prev => prev.length < 3 ? prev + '.' : '');
    }, 500);

    const fadeTimer  = setTimeout(() => setIsFading(true), 2500);
    const navTimer   = setTimeout(() => {
      document.body.classList.remove('splash-active');
      navigate('/home');
    }, 3000);

    return () => {
      clearInterval(dotInterval);
      clearTimeout(fadeTimer);
      clearTimeout(navTimer);
      document.body.classList.remove('splash-active');
    };
  }, [navigate]);

  return (
    <div style={{
      backgroundColor: '#ddd26b',
      height:          '100vh',
      display:         'flex',
      justifyContent:  'center',
      alignItems:      'center',
      overflow:        'hidden',
      position:        'relative',
    }}>
      {/* Background decorative circles */}
      <div style={{
        position: 'absolute', top: '-60px', left: '-60px',
        width: '220px', height: '220px', borderRadius: '50%',
        background: 'rgba(102,33,12,0.1)',
      }} />
      <div style={{
        position: 'absolute', bottom: '-40px', right: '-40px',
        width: '160px', height: '160px', borderRadius: '50%',
        background: 'rgba(102,33,12,0.08)',
      }} />
      <div style={{
        position: 'absolute', top: '30%', right: '8%',
        width: '60px', height: '60px', borderRadius: '50%',
        background: 'rgba(102,33,12,0.06)',
      }} />

      <div
        className={`loader-container${isFading ? ' fade-out' : ''}`}
        style={{
          textAlign:  'center',
          color:      'rgb(102, 33, 12)',
          opacity:    visible ? 1 : 0,
          transform:  visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        {/* Logo ring with glow */}
        <div
          className="logo"
          style={{
            marginBottom: '20px',
            position: 'relative',
            display: 'inline-block',
          }}
        >
          {/* Glow ring */}
          <div style={{
            position: 'absolute', inset: '-6px',
            borderRadius: '50%',
            background: 'transparent',
            border: '3px solid rgba(102,33,12,0.25)',
            animation: 'pulseRing 2s ease-in-out infinite',
          }} />
          {/* Outer decorative ring */}
          <div style={{
            position: 'absolute', inset: '-12px',
            borderRadius: '50%',
            background: 'transparent',
            border: '2px dashed rgba(102,33,12,0.15)',
            animation: 'spinSlow 8s linear infinite',
          }} />

          <img
            src={logo}
            alt="Chef Logo"
            style={{
              borderRadius: '50%',
              height:       '160px',
              width:        '160px',
              border:       '4px solid rgb(102,33,12)',
              objectFit:    'cover',
              display:      'block',
              boxShadow:    '0 8px 32px rgba(102,33,12,0.35), 0 0 0 6px rgba(221,210,107,0.6)',
            }}
            onError={(e) => {
              // Fallback: show a cooking emoji logo
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement.innerHTML = `
                <div style="
                  width:160px; height:160px; border-radius:50%;
                  background:rgb(102,33,12); border:4px solid rgba(102,33,12,0.5);
                  display:flex; align-items:center; justify-content:center;
                  font-size:72px; box-shadow: 0 8px 32px rgba(102,33,12,0.35);
                ">🍳</div>
              `;
            }}
          />
        </div>

        <h1 style={{
          fontSize:   '2.6rem',
          marginBottom: '4px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
          color:      'rgb(102,33,12)',
          letterSpacing: '0.02em',
        }}>
          All About Cooking
        </h1>
        <p style={{
          fontSize: '0.95rem',
          color: 'rgba(102,33,12,0.7)',
          marginBottom: '4px',
          fontStyle: 'italic',
        }}>
          Authentic · Simple · Filipino
        </p>

        <div className="spinner" style={{
          borderColor:    'rgba(102,33,12,0.15)',
          borderTopColor: 'rgb(102,33,12)',
          margin: '20px auto',
        }} />

        <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'rgb(102,33,12)' }}>
          Loading<span style={{ display: 'inline-block', width: '28px', textAlign: 'left' }}>{dots}</span>
        </div>
      </div>

      <style>{`
        @keyframes pulseRing {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50%       { transform: scale(1.08); opacity: 1; }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default SplashPage;