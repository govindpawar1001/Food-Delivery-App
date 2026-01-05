import React from 'react';

const About = () => {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.content}>
          <h1 style={styles.title}>About Foody</h1>
          <p style={styles.subtitle}>
            We're revolutionizing food delivery with smart logistics and exceptional service
          </p>
        </div>
      </div>
      
      <div style={styles.section}>
        <div style={styles.content}>
          <div style={styles.grid}>
            <div style={styles.textBlock}>
              <h2 style={styles.sectionTitle}>Our Mission</h2>
              <p style={styles.text}>
                To connect food lovers with their favorite restaurants through lightning-fast delivery 
                powered by smart logistics and technology.
              </p>
            </div>
            <div style={styles.statsGrid}>
              <div style={styles.stat}>
                <div style={styles.statNumber}>50+</div>
                <div style={styles.statLabel}>Cities</div>
              </div>
              <div style={styles.stat}>
                <div style={styles.statNumber}>2.5K+</div>
                <div style={styles.statLabel}>Reviews</div>
              </div>
              <div style={styles.stat}>
                <div style={styles.statNumber}>50K+</div>
                <div style={styles.statLabel}>Customers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '90vh',
    background: 'linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)'
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
    alignItems: 'center'
  },
  textBlock: {
    padding: '2rem'
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '1rem'
  },
  text: {
    fontSize: '1.1rem',
    color: '#666',
    lineHeight: '1.6'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2rem'
  },
  stat: {
    textAlign: 'center',
    padding: '2rem',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,255,0.9) 100%)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15)',
    border: '1px solid rgba(255,255,255,0.2)'
  },
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#ff6b35',
    marginBottom: '0.5rem'
  },
  statLabel: {
    fontSize: '1rem',
    color: '#666',
    fontWeight: '500'
  }
};

export default About;