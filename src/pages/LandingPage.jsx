import { Link } from 'react-router-dom';
import {
  BookOpen, Activity, Heart, Calendar, FileText,
  Shield, Zap, ArrowRight, Smile, PenTool
} from 'lucide-react';

const FEATURES = [
  {
    icon: <PenTool size={24} />,
    title: 'Daily Journaling',
    desc: 'Write down your thoughts, reflect on your day, and build a consistent writing habit.',
    color: '#3b82f6',
  },
  {
    icon: <Activity size={24} />,
    title: 'Mood Tracking',
    desc: 'Easily log your emotions and see how your mood changes over time with beautiful charts.',
    color: '#8b5cf6',
  },
  {
    icon: <Calendar size={24} />,
    title: 'Entry History',
    desc: 'Scroll through your past entries to see how much you have grown and learned.',
    color: '#14b8a6',
  },
  {
    icon: <Shield size={24} />,
    title: 'Secure & Private',
    desc: 'Your journal is protected with Firebase Auth — accessible only by you.',
    color: '#ec4899',
  },
  {
    icon: <Zap size={24} />,
    title: 'Real-Time Sync',
    desc: 'All changes sync instantly to the cloud — access your journal from any device.',
    color: '#06b6d4',
  },
];

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="landing-nav" style={{ padding: '20px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="navbar-logo" style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700 }}>
              <div className="logo-icon" style={{ width: 36, height: 36, background: 'var(--gradient-primary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <BookOpen size={18} />
              </div>
              <span style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>DailyJournal</span>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link to="/auth" className="btn btn-secondary">Sign In</Link>
              <Link to="/auth" className="btn btn-primary">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero" style={{ padding: '80px 0', textAlign: 'center', position: 'relative' }}>
        <div className="hero-orb hero-orb-1" style={{ position: 'absolute', width: 500, height: 500, background: 'rgba(59,130,246,0.1)', filter: 'blur(80px)', top: -100, left: '50%', transform: 'translateX(-50%)', borderRadius: '50%', zIndex: -1 }} />
        <div className="container">
          <div className="hero-content animate-fade-in" style={{ maxWidth: 800, margin: '0 auto' }}>
            <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: 20 }}>
              Capture your days.<br />
              <span className="gradient-text">Understand yourself.</span>
            </h1>
            <p className="hero-subtitle" style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: 40, lineHeight: 1.6 }}>
              The daily journal for students. Track your mood, write your thoughts, and discover patterns in your daily life in one beautiful, private space.
            </p>
            <div className="hero-cta" style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
              <Link to="/auth" id="hero-get-started" className="btn btn-primary btn-lg">
                Start Journaling Free <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="landing-features" style={{ padding: '80px 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: '2rem', marginBottom: 10 }}>Everything you need to <span className="gradient-text">reflect</span></h2>
            <p style={{ color: 'var(--text-secondary)' }}>Simple tools to help you understand your daily journey.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 30 }}>
            {FEATURES.map((f) => (
              <div key={f.title} className="card" style={{ padding: 30, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ width: 50, height: 50, borderRadius: 12, background: `${f.color}15`, color: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer" style={{ padding: '40px 0', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="navbar-logo" style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700 }}>
              <div className="logo-icon" style={{ width: 28, height: 28, background: 'var(--gradient-primary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <BookOpen size={14} />
              </div>
              <span style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>DailyJournal</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
              © 2026 DailyJournal. Built for students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
