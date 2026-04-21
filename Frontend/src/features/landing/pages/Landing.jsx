import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../auth/hooks/useAuth';
import '../landing.scss';

const Landing = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Interview AI - Master Your Next Tech Interview";
    }, []);

    // If authenticated, we give them a fast path to the dashboard
    const handleCTAClick = () => {
        if (user) {
            navigate('/dashboard');
        } else {
            navigate('/register');
        }
    };

    if (loading) {
        return (
            <main className='landing-loading'>
                <div className="spinner"></div>
            </main>
        );
    }

    return (
        <div className="landing-page">
            {/* Top Navigation for Landing */}
            <nav className="landing-nav">
                <div className="landing-nav__brand">
                    <img src="/logo.png" alt="Interview AI Logo" className="landing-nav__logo" />
                    Interview <span className="highlight">AI</span>
                </div>
                <div className="landing-nav__actions">
                    {user ? (
                        <button className="btn-primary" onClick={() => navigate('/dashboard')}>
                            Go to Dashboard
                        </button>
                    ) : (
                        <>
                            <Link to="/login" className="btn-secondary">Log In</Link>
                            <Link to="/register" className="btn-primary">Get Started</Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero-section">
                <div className="hero-section__content">
                    <div className="badge">⚡ The #1 AI Interview Prep Platform</div>
                    <h1 className="hero-title">
                        Crack Your Next <br />
                        <span className="text-gradient">Tech Interview</span>
                    </h1>
                    <p className="hero-subtitle">
                        Upload your resume, paste the job description, and let our advanced AI generate a hyper-personalized interview strategy to guarantee your success in 30 seconds.
                    </p>
                    <div className="hero-cta-group">
                        <button className="btn-primary btn-large" onClick={handleCTAClick}>
                            {user ? "Resume Practicing" : "Start For Free"}
                        </button>
                        {!user && (
                            <span className="cta-note">No credit card required.</span>
                        )}
                    </div>
                </div>

                <div className="hero-section__graphic">
                    {/* Abstract Floating UI Elements for the Hero */}
                    <div className="floating-card report-card">
                        <div className="pulse-icon"></div>
                        <span>Match Score: 92%</span>
                    </div>
                    <div className="floating-card profile-card">
                        <div className="avatar-placeholder"></div>
                        <div className="lines">
                            <div className="line long"></div>
                            <div className="line short"></div>
                        </div>
                    </div>
                    <div className="glowing-orb orb-1"></div>
                    <div className="glowing-orb orb-2"></div>
                </div>
            </header>

            {/* Features Preview */}
            <section className="features-preview">
                <div className="feature-item">
                    <div className="feature-icon">📄</div>
                    <h3>Smart Resume Parsing</h3>
                    <p>We deeply analyze your unique experiences to tailor your answers.</p>
                </div>
                <div className="feature-item">
                    <div className="feature-icon">🎯</div>
                    <h3>Precision Targeting</h3>
                    <p>Paste any job description and instantly discover what the employer wants.</p>
                </div>
                <div className="feature-item">
                    <div className="feature-icon">🤖</div>
                    <h3>Custom AI Plans</h3>
                    <p>Get actionable roadmaps and mock questions specific to your dream role.</p>
                </div>
            </section>
        </div>
    );
};

export default Landing;
