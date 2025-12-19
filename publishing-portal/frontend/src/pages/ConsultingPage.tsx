import { Link } from 'react-router-dom';
import './ConsultingPage.css';

const ConsultingPage = () => {
    return (
        <div className="consulting-page">
            <div className="container">
                <header className="page-header">
                    <h1>Work with SatSpace</h1>
                    <p className="lead">
                        SatSpace provides independent, technically grounded advice at the intersection
                        of satellites, telecom and cloud.
                    </p>
                </header>

                <section className="services-section">
                    <h2>Where We Help</h2>

                    <div className="services-grid">
                        <div className="service-card">
                            <h3>Strategy & Market Insight</h3>
                            <p>
                                D2D, LEO, multi-orbit and IFC market sizing, competitor mapping and scenario planning.
                            </p>
                        </div>

                        <div className="service-card">
                            <h3>Architecture & Technology Advisory</h3>
                            <p>
                                High-level designs for multi-orbit networks, traffic steering, orchestration
                                platforms and QoE monitoring.
                            </p>
                        </div>

                        <div className="service-card">
                            <h3>Policy & Regulatory Context</h3>
                            <p>
                                Briefings on spectrum, licensing and regulatory trends impacting LEO/NTN
                                deployments in India, GCC and global markets.
                            </p>
                        </div>

                        <div className="service-card">
                            <h3>Workshops & Speaking</h3>
                            <p>
                                Tailored sessions for leadership teams, boards and industry events on the
                                future of satellite connectivity.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="contact-section">
                    <h2>Get in Touch</h2>
                    <p>To discuss a project or request a briefing:</p>

                    <form className="contact-form">
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" placeholder="Your name" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="organization">Organization</label>
                            <input type="text" id="organization" placeholder="Company or institution" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" placeholder="your.email@example.com" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Project Details</label>
                            <textarea
                                id="message"
                                rows={6}
                                placeholder="Tell us about your project or inquiry..."
                            ></textarea>
                        </div>

                        <button type="button" className="btn btn-primary" onClick={() => {
                            window.location.href = 'mailto:davis@satspace.in?subject=Consulting Inquiry';
                        }}>
                            Send Inquiry
                        </button>

                        <p className="form-note">
                            Or email directly: <a href="mailto:davis@satspace.in">davis@satspace.in</a>
                        </p>
                    </form>
                </section>

                <div className="back-link">
                    <Link to="/">← Back to Home</Link>
                </div>
            </div>
        </div>
    );
};

export default ConsultingPage;
