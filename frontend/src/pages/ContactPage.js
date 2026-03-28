// frontend/src/pages/ContactPage.js
import { useState } from 'react';
import API from '../api/axios';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', subject: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setLoading(true);

    try {
      await API.post('/contact', formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      if (!err.response) {
        setApiError('Cannot connect to the server. Make sure backend and database are running.');
      } else {
        setApiError(err.response?.data?.message || 'Failed to send message. Please try again.');
      }
    } finally {
      setLoading(false);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <main className="main-content">
    <>
      <div className="content">
        <h2>Contact Me 📬</h2>
        <p style={{ textAlign: 'center', marginBottom: '20px' }}>
          Have a recipe question or just want to say hi? Drop me a message!
        </p>

        {submitted && (
          <div style={{
            background: 'rgba(255,152,0,0.1)', border: '1px solid var(--snd-bg-color)',
            borderRadius: '8px', padding: '14px 18px', marginBottom: '16px',
            textAlign: 'center', fontWeight: '700', color: 'var(--snd-bg-color)',
            fontSize: '1rem',
          }}>
            ✅ Message sent! I'll get back to you soon. 🍳
          </div>
        )}

        {apiError && (
          <div style={{
            color: '#c62828',
            background: 'rgba(229,57,53,0.1)',
            border: '1px solid #e53935',
            borderRadius: '8px',
            padding: '12px 14px',
            marginBottom: '16px',
            fontWeight: '600',
          }}>
            ⚠️ {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Your Name:</label>
          <input
            type="text" id="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email Address:</label>
          <input
            type="email" id="email"
            placeholder="foodie@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="subject">Subject:</label>
          <input
            type="text" id="subject"
            placeholder="What's this about?"
            value={formData.subject}
            onChange={handleChange}
            required
          />

          <label htmlFor="message">Message:</label>
          <textarea
            id="message" rows="6"
            placeholder="Write your message here..."
            value={formData.message}
            onChange={handleChange}
            required
          />

          <button type="submit" id="newcolor" disabled={loading}>
            {loading ? 'Sending...' : 'Send Message ✉️'}
          </button>
        </form>
      </div>

      {/* Resources & Map */}
      <div className="content">
        <section>
          <h2>Philippine Cuisine Resources</h2>
          <table>
            <thead>
              <tr>
                <th>Website</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <a href="https://panlasangpinoy.com" target="_blank" rel="noreferrer">
                    Panlasang Pinoy
                  </a>
                </td>
                <td>Authentic Filipino Recipes</td>
              </tr>
              <tr>
                <td>
                  <a href="https://www.kawalingpinoy.com" target="_blank" rel="noreferrer">
                    Kawaling Pinoy
                  </a>
                </td>
                <td>Traditional Home Cooking</td>
              </tr>
              <tr>
                <td>
                  <a href="https://www.yummy.ph" target="_blank" rel="noreferrer">
                    Yummy.ph
                  </a>
                </td>
                <td>Local Food Guide &amp; Recipes</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section style={{ marginTop: '24px' }}>
          <h2>My Location: Aringay, La Union</h2>
          <div className="map-container">
            <iframe
              title="Aringay Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15380.123!2d120.3541!3d16.4039!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3391a6c4e9b2e3b5%3A0x1a2b3c4d5e6f7890!2sAringay%2C%20La%20Union!5e0!3m2!1sen!2sph!4v1700000000000"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
      </div>
    </>
    </main>
  );
}

export default ContactPage;