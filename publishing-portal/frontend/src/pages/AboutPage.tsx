import { Link } from 'react-router-dom';
import './AboutPage.css';

const AboutPage = () => {
    return (
        <div className="about-page">
            <div className="container">
                <header className="page-header">
                    <h1>About SatSpace</h1>
                </header>

                <div className="about-content">
                    <section className="about-section">
                        <p className="lead">
                            SatSpace is edited by <strong>Davis Mathew Kuriakose</strong>, a SatCom specialist and
                            engineering leader whose career spans operators, integrators and startups across India,
                            the Middle East and global markets.
                        </p>

                        <p>
                            Davis has worked on satellite network management, IFC connectivity and multi-orbit
                            architectures, and has been quoted by outlets such as Reuters and Kratos Constellations
                            on the economics and regulation of satellite broadband.
                        </p>

                        <p>
                            He co-founded Quvia (formerly Neuron), an AI-powered QoE platform used for satellite
                            and hybrid networks, and currently works in communication payload operations at AST SpaceMobile.
                        </p>

                        <p>
                            <strong>SatSpace.in</strong> is his independent platform for analysis on D2D, multi-orbit
                            networking, satellite economics and policy.
                        </p>
                    </section>

                    <section className="connect-section">
                        <h2>Connect</h2>
                        <div className="connect-links">
                            <a href="mailto:davis@satspace.in" className="connect-link">
                                <span className="icon">✉️</span> davis@satspace.in
                            </a>
                            <a href="https://linkedin.com/in/davismathewkuriakose" target="_blank" rel="noopener noreferrer" className="connect-link">
                                <span className="icon">💼</span> LinkedIn
                            </a>
                            <a href="https://twitter.com/davismathewk" target="_blank" rel="noopener noreferrer" className="connect-link">
                                <span className="icon">🐦</span> Twitter
                            </a>
                        </div>
                    </section>

                    <section className="mission-section">
                        <h2>Mission</h2>
                        <p>
                            SatSpace provides independent, technically grounded analysis at the intersection of
                            satellites, telecom and cloud. We unpack D2D, multi-orbit networks and the economics
                            of global connectivity—for operators, investors and policymakers.
                        </p>
                    </section>
                </div>

                <div className="back-link">
                    <Link to="/">← Back to Home</Link>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
