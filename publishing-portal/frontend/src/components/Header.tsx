import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="header">
            <div className="container header-content">
                <Link to="/" className="logo">
                    <h1>SAT<span className="highlight">SPACE</span></h1>
                    <p className="tagline">Space. Business. Technology.</p>
                </Link>

                <button
                    className="mobile-menu-toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    ☰
                </button>

                <nav className={`nav ${mobileMenuOpen ? 'nav-open' : ''}`}>
                    <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                    <Link to="/news" className="nav-link" onClick={() => setMobileMenuOpen(false)}>News</Link>
                    <Link to="/commercial" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Commercial</Link>
                    <Link to="/technology" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Technology</Link>
                    <Link to="/policy" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Policy</Link>
                    <Link to="/about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>About</Link>
                </nav>

                <div className="header-actions">
                    <a href="mailto:davis@satspace.in?subject=Subscribe to SatSpace Signals" className="btn btn-primary">
                        Subscribe
                    </a>
                </div>
            </div>
        </header>
    );
};

export default Header;
