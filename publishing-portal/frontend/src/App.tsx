import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';
import CategoryPage from './pages/CategoryPage';
import ConsultingPage from './pages/ConsultingPage';
import AboutPage from './pages/AboutPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/posts/:slug" element={<ArticlePage />} />

            {/* Category Pages */}
            <Route path="/news" element={
              <CategoryPage
                category="news"
                title="News"
                description="Short, timely updates on the companies, constellations and policies reshaping satellite connectivity. Launches, licenses, partnerships and funding—curated and explained."
              />
            } />
            <Route path="/commercial" element={
              <CategoryPage
                category="commercial"
                title="Commercial"
                description="Deep dives into the business side of space. We decode revenue models, M&A moves and competitive positioning across D2D, IFC, backhaul and consumer LEO."
              />
            } />
            <Route path="/technology" element={
              <CategoryPage
                category="technology"
                title="Technology"
                description="Explainers and technical analysis on D2D, NTN, multi-orbit architecture and AI-defined networks. Written for engineers and business leaders who want to understand how it actually works."
              />
            } />
            <Route path="/military-government" element={
              <CategoryPage
                category="military"
                title="Military & Government"
                description="How defense, civil aviation and government agencies are adopting hybrid satellite networks—and what it means for resilience, security and policy."
              />
            } />
            <Route path="/launch" element={
              <CategoryPage
                category="launch"
                title="Launch"
                description="Launch vehicles, economics and cadence. We track how rockets enable (or constrain) the next generation of constellations."
              />
            } />
            <Route path="/policy" element={
              <CategoryPage
                category="policy"
                title="Policy"
                description="Regulatory and spectrum analysis across India, GCC, Europe and beyond. ITU filings, national licensing and the politics of LEO."
              />
            } />
            <Route path="/research" element={
              <CategoryPage
                category="research"
                title="Research"
                description="Formal whitepapers and long-form studies authored by SatSpace. Designed for decision-makers who need structured, referenced insight."
              />
            } />

            {/* Static Pages */}
            <Route path="/consulting" element={<ConsultingPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <footer className="footer">
          <div className="container">
            <p>&copy; {new Date().getFullYear()} Satspace. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
