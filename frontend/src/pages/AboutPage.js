// frontend/src/pages/AboutPage.js
import React, { useState } from 'react';
import pic1 from '../pictures/pic1.jpg';
import logo from '../pictures/chefgirl.avif';

const quizData = [
  { question: "What do we call the process of preparing food?",       options: ["Baking","Cooking","Frying","Mixing"],              answer: 1 },
  { question: "What do we call making cakes and bread in the oven?",   options: ["Boiling","Grilling","Baking","Steaming"],           answer: 2 },
  { question: "What do we use to fry eggs?",                           options: ["Plate","Bowl","Pan","Spoon"],                       answer: 2 },
  { question: "What tool do we use to cut vegetables?",                options: ["Fork","Knife","Cup","Pot"],                         answer: 1 },
  { question: "What do we call the items needed to make a recipe?",    options: ["Tools","Dishes","Ingredients","Utensils"],          answer: 2 },
];

function AboutPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex,  setSelectedOptionIndex]  = useState(null);
  const [score,         setScore]         = useState(0);
  const [showResult,    setShowResult]    = useState(false);
  const [resultMessage, setResultMessage] = useState({ text: '', color: '' });
  const [quizComplete,  setQuizComplete]  = useState(false);
  const [lightboxImg,   setLightboxImg]   = useState(null);

  const handleOptionClick = (index) => {
    if (showResult) return;
    setSelectedOptionIndex(index);
  };

  const handleSubmit = () => {
    const isCorrect = selectedOptionIndex === quizData[currentQuestionIndex].answer;
    if (isCorrect) {
      setScore(s => s + 1);
      setResultMessage({ text: '✅ Correct!', color: '#2e7d32' });
    } else {
      setResultMessage({
        text:  `❌ Wrong! Correct answer: ${quizData[currentQuestionIndex].options[quizData[currentQuestionIndex].answer]}`,
        color: '#c62828',
      });
    }
    setShowResult(true);

    setTimeout(() => {
      setShowResult(false);
      setSelectedOptionIndex(null);
      if (currentQuestionIndex + 1 < quizData.length) {
        setCurrentQuestionIndex(i => i + 1);
      } else {
        setQuizComplete(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0); setSelectedOptionIndex(null);
    setScore(0); setShowResult(false);
    setResultMessage({ text: '', color: '' }); setQuizComplete(false);
  };

  return (
    <main className="main-content">
      {/* ── Lightbox ── */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, cursor: 'zoom-out',
          }}
        >
          <img
            src={logo}
            alt="Enlarged"
            style={{
              maxWidth: '90vw', maxHeight: '85vh',
              borderRadius: '10px', border: '3px solid var(--snd-bg-color)',
              objectFit: 'contain',
              boxShadow: '0 0 60px rgba(255,152,0,0.3)',
            }}
          />
          <button
            onClick={() => setLightboxImg(null)}
            style={{
              position: 'absolute', top: '20px', right: '24px',
              background: 'var(--snd-bg-color)', border: 'none',
              color: 'white', fontSize: '1.4rem', width: '36px', height: '36px',
              borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* ── About ── */}
      <div className="content">
        <section style={{ textAlign: 'center' }}>
          <img
            src={logo}
            alt="Chef"
            style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 16px', border: '3px solid var(--snd-bg-color)' }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <h2>Welcome to my Culinary Corner!</h2>
          <p>I started cooking 5 years ago and haven't looked back since. My goal is to share simple, delicious Filipino recipes.</p>
        </section>

        <img
          src={pic1}
          alt="Fresh Petchay"
          style={{ width: '100%', borderRadius: '8px', border: 'none' }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        <div className="content">
        <h3>My Learning Timeline</h3>
        <ol style={{ paddingLeft: '20px', lineHeight: '2.1' }}>
          <li><strong>2020:</strong> Started basic meals during lockdown.</li>
          <li><strong>2022:</strong> Mastered Filipino dishes like Adobo and Sinigang.</li>
          <li><strong>2024:</strong> Began experimenting with baking and pastries.</li>
        </ol>
        <blockquote>
          "Cooking done with care is an act of love." — Craig Claiborne
        </blockquote>
      </div>
      </div>
      {/* ── Quiz ── */}
      <div className="content">
        <h2>🍴 Cooking Knowledge Quiz</h2>

        <div className="quiz-container">
          {!quizComplete ? (
            <>
              {/* Progress */}
              <p style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--snd-bg-color)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                Question {currentQuestionIndex + 1} of {quizData.length}
              </p>
              <div style={{ background: '#ffe0b2', borderRadius: '6px', height: '6px', marginBottom: '14px', overflow: 'hidden' }}>
                <div style={{ width: `${(currentQuestionIndex / quizData.length) * 100}%`, height: '100%', background: 'var(--snd-bg-color)', transition: 'width 0.4s' }} />
              </div>

              <h2 style={{ textAlign: 'left', fontSize: '1.05rem', marginBottom: '14px' }}>
                {quizData[currentQuestionIndex].question}
              </h2>

              <div className="options">
                {quizData[currentQuestionIndex].options.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleOptionClick(index)}
                    className={`option${selectedOptionIndex === index ? ' selected' : ''}`}
                  >
                    {option}
                  </div>
                ))}
              </div>

              <button
                onClick={handleSubmit}
                disabled={selectedOptionIndex === null || showResult}
                style={{
                  background:   selectedOptionIndex === null || showResult ? '#ccc' : 'var(--snd-bg-color)',
                  color:        'white',
                  border:       'none',
                  padding:      '12px 20px',
                  borderRadius: '6px',
                  cursor:       selectedOptionIndex === null || showResult ? 'not-allowed' : 'pointer',
                  fontWeight:   '700',
                  width:        '100%',
                  marginTop:    '10px',
                  fontSize:     '0.95rem',
                  fontFamily:   'inherit',
                }}
              >
                Submit Answer
              </button>

              {showResult && (
                <div style={{
                  marginTop: '14px', fontWeight: 'bold', color: resultMessage.color,
                  textAlign: 'center', padding: '10px', borderRadius: '6px',
                  background: resultMessage.color === '#2e7d32' ? 'rgba(46,125,50,0.1)' : 'rgba(198,40,40,0.1)',
                }}>
                  {resultMessage.text}
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{
                width: '90px', height: '90px', borderRadius: '50%',
                background: 'var(--snd-bg-color)', color: 'white',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.8rem', fontWeight: '900', marginBottom: '14px',
              }}>
                {score}/{quizData.length}
              </div>
              <h2>Quiz Complete!</h2>
              <p style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                {score === quizData.length ? '🏆 Perfect score! Great kitchen knowledge.' :
                 score >= 3 ? '👨‍🍳 Nice work! Keep cooking.' : '📚 Practice more — every meal teaches something!'}
              </p>
              <button
                onClick={resetQuiz}
                style={{
                  background: 'var(--snd-bg-color)', color: 'white', border: 'none',
                  padding: '10px 24px', borderRadius: '6px', fontWeight: '700',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Restart Quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default AboutPage;