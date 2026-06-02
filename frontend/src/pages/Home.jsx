import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function ScrollReveal({ children, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${visible ? 'visible' : ''} ${className}`}>
      {children}
    </div>
  );
}

export default function Home({ user }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user) {
      api.get('/requests/dashboard/stats')
        .then((res) => setStats(res.data))
        .catch(() => {});
    }
  }, [user]);

  const dashStats = [
    { label: '500+', sub: 'Pets Adopted', icon: '❤️' },
    { label: '120+', sub: 'Partner Shelters', icon: '🏠' },
    { label: '1000+', sub: 'Happy Families', icon: '🐾' },
  ];

  const processSteps = [
    { num: 1, title: 'Browse Pets', desc: 'Explore pets available for adoption near you.' },
    { num: 2, title: 'Submit Request', desc: 'Send an adoption request to the pet owner or shelter.' },
    { num: 3, title: 'Meet & Verify', desc: 'Connect and complete the adoption process.' },
    { num: 4, title: 'Welcome Home', desc: 'Give your new companion a loving forever home.' },
  ];

  const testimonials = [
    {
      name: 'Priya & Max',
      quote: 'Adopting Max was the best decision we ever made. The process was simple and we found our perfect companion.',
      image: 'https://images.pexels.com/photos/733416/pexels-photo-733416.jpeg?w=100&h=100&fit=crop',
    },
    {
      name: 'Rahul & Bella',
      quote: 'The platform made it so easy to find and adopt Bella. She has brought so much joy into our home.',
      image: 'https://images.pexels.com/photos/551628/pexels-photo-551628.jpeg?w=100&h=100&fit=crop',
    },
    {
      name: 'Ananya & Simba',
      quote: 'I always wanted to adopt and give a stray a home. This platform connected me with Simba and it was love at first sight.',
      image: 'https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?w=100&h=100&fit=crop',
    },
  ];

  const statCards = [
    { value: '500+', label: 'Pets Adopted', icon: '❤️' },
    { value: '120+', label: 'Partner Shelters', icon: '🏠' },
    { value: '1000+', label: 'Families Connected', icon: '🐾' },
    { value: '95%', label: 'Successful Adoptions', icon: '⭐' },
  ];

  return (
    <>
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <ScrollReveal>
                <h1 className="hero-heading">
                  Give a Pet a Second Chance{" "}
                  <span role="img" aria-label="paw">
                    🐾
                  </span>
                </h1>
                <p className="hero-subtitle">
                  Find loving dogs and cats waiting for a forever home. Every
                  adoption saves a life and creates room for another rescue.
                </p>
                <p className="hero-mission-line">
                  Supporting the &ldquo;Adopt, Don&rsquo;t Shop&rdquo; mission{" "}
                  <span role="img" aria-label="paw"></span>
                </p>
                <div className="hero-actions d-flex flex-wrap gap-3">
                  <Link to="/pets" className="btn btn-primary btn-lg px-4">
                    Browse Pets
                  </Link>
                  <a
                    href="#mission"
                    className="btn btn-outline-primary btn-lg px-4"
                  >
                    Learn More
                  </a>
                </div>
              </ScrollReveal>
            </div>
            <div className="col-lg-6">
              <ScrollReveal>
                <div className="hero-image-wrapper">
                  <img
                    src="https://images.pexels.com/photos/31308251/pexels-photo-31308251.jpeg"
                    alt="Happy pets looking for a home"
                    className="hero-image"
                  />
                  <div className="floating-stat top-left">
                    <span>❤️</span> 500+ Pets Adopted
                  </div>
                  <div className="floating-stat bottom-right">
                    <span>🏠</span> 120+ Shelters
                  </div>
                  <div className="floating-stat top-right">
                    <span>🐾</span> 1000+ Happy Families
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {user && stats && (
        <section className="dashboard-snapshot py-4">
          <div className="container">
            <div className="row g-3">
              <div className="col-12">
                <h5 className="mb-3">Welcome back, {user.name}</h5>
              </div>
              {user.role === "provider" ? (
                <>
                  <div className="col-md-4">
                    <div className="stat-mini-card">
                      <h3>{stats.totalPets}</h3>
                      <p>Total Pets Listed</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="stat-mini-card">
                      <h3>{stats.availablePets}</h3>
                      <p>Available Pets</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="stat-mini-card">
                      <h3>{stats.totalRequests}</h3>
                      <p>Adoption Requests</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="col-md-4">
                    <div className="stat-mini-card">
                      <h3>{stats.totalRequests}</h3>
                      <p>Total Requests</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="stat-mini-card">
                      <h3>{stats.pendingRequests}</h3>
                      <p>Pending Requests</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="stat-mini-card">
                      <h3>{stats.approvedRequests}</h3>
                      <p>Approved Requests</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="process-section py-5">
        <div className="container">
          <ScrollReveal className="text-center mb-5">
            <h2 className="section-heading">How Adoption Works</h2>
          </ScrollReveal>
          <div className="row g-4">
            {processSteps.map((step) => (
              <div key={step.num} className="col-md-3 col-6">
                <ScrollReveal>
                  <div className="process-card">
                    <div className="step-number">{step.num}</div>
                    <h5>{step.title}</h5>
                    <p>{step.desc}</p>
                  </div>
                </ScrollReveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="mission" className="mission-section py-5">
        <div className="container">
          <div className="row justify-content-center align-items-center g-5">
            <div className="col-lg-5">
              <ScrollReveal>
                <div className="mission-image-wrapper">
                  <img
                    src="https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?w=700"
                    alt="Dog and cat together"
                    className="mission-image"
                  />
                  <span className="paw-print paw-1">🐾</span>
                  <span className="paw-print paw-2">🐾</span>
                </div>
              </ScrollReveal>
            </div>
            <div className="col-lg-5">
              <ScrollReveal>
                <h2 className="section-heading">Why Adopt, Don't Shop?</h2>
                <div className="mission-text">
                  <p>Every year, thousands of pets enter shelters and rescue centers looking for a loving home.</p>
                  <p>When you adopt, you're not just gaining a pet — you're giving an animal a second chance at life.</p>
                  <p>Adoption helps reduce overcrowded shelters, discourages unethical breeding practices, and supports responsible pet ownership.</p>
                  <p>By choosing adoption, you become part of a movement that saves lives and creates happier communities for both pets and people.</p>
                  <p className="mission-tagline"><strong>Adopt. Love. Save a Life.</strong></p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section py-5">
        <div className="container">
          <ScrollReveal className="text-center mb-5">
            <h2 className="section-heading text-white">
              Making a Difference Together
            </h2>
          </ScrollReveal>
          <div className="row g-4">
            {statCards.map((s, i) => (
              <div key={i} className="col-md-3 col-6">
                <ScrollReveal>
                  <div className="stat-card-modern">
                    <span className="stat-icon">{s.icon}</span>
                    <h3>{s.value}</h3>
                    <p>{s.label}</p>
                  </div>
                </ScrollReveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonials-section py-5">
        <div className="container">
          <ScrollReveal className="text-center mb-5">
            <h2 className="section-heading">
              Happy Tails{" "}
              <span role="img" aria-label="heart">
                ❤️
              </span>
            </h2>
          </ScrollReveal>
          <div className="row g-4">
            {testimonials.map((t, i) => (
              <div key={i} className="col-md-4">
                <ScrollReveal>
                  <div className="testimonial-card">
                    <div className="testimonial-avatar">
                      <img src={t.image} alt={t.name} />
                    </div>
                    <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
                    <p className="testimonial-name">&mdash; {t.name}</p>
                  </div>
                </ScrollReveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section py-5 text-center">
        <div className="container">
          <ScrollReveal>
            <h2 className="cta-heading">Ready to Change a Life?</h2>
            <p className="cta-subtitle">
              Thousands of pets are waiting for a loving family. Start your
              adoption journey today.
            </p>
            <Link to="/pets" className="btn btn-light btn-lg px-5">
              Browse Pets
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
