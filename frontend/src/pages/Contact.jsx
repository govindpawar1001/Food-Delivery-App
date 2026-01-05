import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.content}>
          <h1 style={styles.title}>Contact Us</h1>
          <p style={styles.subtitle}>
            Have questions? We'd love to hear from you
          </p>
        </div>
      </div>
      
      <div style={styles.section}>
        <div style={styles.content}>
          <div style={styles.grid}>
            <div style={styles.contactInfo}>
              <h2 style={styles.sectionTitle}>Get in Touch</h2>
              <div style={styles.contactItem}>
                <div style={styles.contactIcon}>📧</div>
                <div>
                  <div style={styles.contactLabel}>Email</div>
                  <div style={styles.contactValue}>support@foody.com</div>
                </div>
              </div>
              <div style={styles.contactItem}>
                <div style={styles.contactIcon}>📞</div>
                <div>
                  <div style={styles.contactLabel}>Phone</div>
                  <div style={styles.contactValue}>1-800-FOODY</div>
                </div>
              </div>
              <div style={styles.contactItem}>
                <div style={styles.contactIcon}>🕒</div>
                <div>
                  <div style={styles.contactLabel}>Hours</div>
                  <div style={styles.contactValue}>24/7 Support</div>
                </div>
              </div>
            </div>
            
            <form style={styles.form} onSubmit={handleSubmit}>
              <h2 style={styles.formTitle}>Send us a Message</h2>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                style={styles.input}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                required
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                style={styles.textarea}
                rows="5"
                required
              />
              <button type="submit" style={styles.submitBtn}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '90vh',
    backgroundColor: '#fef7f0'
  },
  hero: {
    padding: '4rem 0',
    textAlign: 'center'
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem'
  },
  title: {
    fontSize: '3rem',
    fontWeight: '700',
    color: '#333',
    marginBottom: '1rem'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#666',
    maxWidth: '600px',
    margin: '0 auto'
  },
  section: {
    padding: '4rem 0'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4rem',
    alignItems: 'start'
  },
  contactInfo: {
    padding: '2rem'
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '2rem'
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem'
  },
  contactIcon: {
    fontSize: '2rem',
    width: '50px',
    height: '50px',
    backgroundColor: '#ff6b35',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  contactLabel: {
    fontSize: '0.9rem',
    color: '#666',
    fontWeight: '500'
  },
  contactValue: {
    fontSize: '1.1rem',
    color: '#333',
    fontWeight: '600'
  },
  form: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  formTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '2rem'
  },
  input: {
    width: '100%',
    padding: '1rem',
    marginBottom: '1rem',
    border: '2px solid #f0f0f0',
    borderRadius: '10px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '1rem',
    marginBottom: '1rem',
    border: '2px solid #f0f0f0',
    borderRadius: '10px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s',
    resize: 'vertical',
    boxSizing: 'border-box'
  },
  submitBtn: {
    backgroundColor: '#ff6b35',
    color: 'white',
    padding: '1rem 2rem',
    border: 'none',
    borderRadius: '25px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    width: '100%'
  }
};

export default Contact;