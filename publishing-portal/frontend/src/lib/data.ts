import heroImage from "@/assets/hero-rocket-launch.jpg";
import starshipImage from "@/assets/article-starship.jpg";
import issImage from "@/assets/article-iss.jpg";
import jwstImage from "@/assets/article-jwst.jpg";
import marsImage from "@/assets/article-mars.jpg";
import satellitesImage from "@/assets/article-satellites.jpg";

export type Category = 
  | "Launch" 
  | "Exploration" 
  | "Technology" 
  | "Commercial" 
  | "Military" 
  | "Policy";

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: Category;
  image: string;
  author: string;
  date: string;
  readTime: string;
  featured?: boolean;
}

export const categories: Category[] = [
  "Launch",
  "Exploration",
  "Technology",
  "Commercial",
  "Military",
  "Policy",
];

export const articles: Article[] = [
  {
    id: "1",
    slug: "spacex-starship-orbital-flight-success",
    title: "SpaceX Achieves Historic Starship Orbital Flight Success",
    excerpt: "The world's most powerful rocket completes its first full orbital mission, marking a new era in space exploration and interplanetary travel capabilities.",
    content: `SpaceX has successfully completed the first full orbital flight of its Starship rocket, marking a historic milestone in space exploration history. The massive vehicle, standing at 397 feet tall, lifted off from Starbase in Boca Chica, Texas, at 7:25 AM local time.

The mission achieved all primary objectives, including successful stage separation, orbital insertion, and controlled reentry of the Super Heavy booster. The spacecraft completed nearly one full orbit of Earth before executing a precise splashdown in the Indian Ocean.

"This is a day we've been working toward for over a decade," said SpaceX CEO Elon Musk during a post-flight press conference. "Starship represents our path to becoming a multi-planetary species."

The success opens the door for NASA's Artemis program, which will use Starship as the human landing system for returning astronauts to the lunar surface. Commercial satellite deployment missions are expected to begin as early as next year.

Industry analysts predict the achievement will accelerate competition in the heavy-lift launch market, with implications for both commercial and government space programs worldwide.`,
    category: "Launch",
    image: heroImage,
    author: "Sarah Mitchell",
    date: "December 19, 2024",
    readTime: "5 min read",
    featured: true,
  },
  {
    id: "2",
    slug: "starship-flight-7-preparations",
    title: "Starship Flight 7 Prepares for Revolutionary Catch Attempt",
    excerpt: "SpaceX readies next Starship test with ambitious booster recovery using mechanical arms at launch tower.",
    content: `SpaceX is preparing for its seventh Starship test flight, which will attempt an even more ambitious booster recovery maneuver. The company has made significant upgrades to the launch tower's mechanical catch arms following lessons learned from previous flights.

The upcoming mission will test new heat shield configurations and improved flight software designed to enable more precise booster returns. Engineers have been conducting extensive simulations to optimize the catch trajectory.

"We're pushing the boundaries of what's possible with rocket reusability," said a SpaceX spokesperson. "Each flight teaches us something new."

The launch window opens next month, pending regulatory approval from the FAA.`,
    category: "Launch",
    image: starshipImage,
    author: "James Chen",
    date: "December 18, 2024",
    readTime: "4 min read",
  },
  {
    id: "3",
    slug: "nasa-astronauts-iss-record-mission",
    title: "NASA Astronauts Break ISS Continuous Occupancy Record",
    excerpt: "International Space Station marks 25 years of uninterrupted human presence in orbit with crew milestone.",
    content: `The International Space Station has achieved a remarkable milestone: 25 years of continuous human occupation. The current Expedition 72 crew celebrated the anniversary with a special ceremony broadcast live to Earth.

Since the first crew arrived on November 2, 2000, the station has hosted 273 individuals from 21 countries. The orbiting laboratory has enabled groundbreaking research in microgravity science, human physiology, and Earth observation.

"The ISS represents humanity's greatest achievement in international cooperation," said NASA Administrator Bill Nelson. "It has taught us how to live and work in space."

NASA and its partners are now planning the transition to commercial space stations as the ISS approaches the end of its operational life in the early 2030s.`,
    category: "Exploration",
    image: issImage,
    author: "Emily Rodriguez",
    date: "December 17, 2024",
    readTime: "6 min read",
  },
  {
    id: "4",
    slug: "james-webb-exoplanet-discovery",
    title: "Webb Telescope Discovers New Earth-Like Exoplanet System",
    excerpt: "JWST identifies potentially habitable world orbiting nearby star with atmospheric signatures suggesting water.",
    content: `The James Webb Space Telescope has made what scientists are calling one of the most significant exoplanet discoveries to date. The telescope has identified an Earth-sized planet orbiting within the habitable zone of a star just 40 light-years from our solar system.

Spectroscopic analysis of the planet's atmosphere reveals the presence of water vapor and potential biosignature gases. The finding has energized the search for extraterrestrial life.

"This is exactly the kind of world we built Webb to find," said Dr. Jane Rigby, Webb's Senior Project Scientist at NASA. "We're now conducting follow-up observations to characterize the atmosphere in detail."

The discovery demonstrates Webb's unprecedented capability to study the atmospheres of small, rocky planets around distant stars.`,
    category: "Technology",
    image: jwstImage,
    author: "Dr. Michael Foster",
    date: "December 16, 2024",
    readTime: "7 min read",
  },
  {
    id: "5",
    slug: "perseverance-mars-sample-update",
    title: "Perseverance Rover Completes Mars Sample Collection Campaign",
    excerpt: "NASA's rover deposits final sample tubes for future Mars Sample Return mission retrieval.",
    content: `NASA's Perseverance rover has completed its sample collection campaign on Mars, depositing the final set of tubes containing Martian rock and soil at a designated drop-off location in Jezero Crater.

The 30 sample tubes represent the most diverse collection of materials ever gathered from another planet, including samples from ancient river delta deposits that may contain evidence of past microbial life.

"These samples hold the potential to answer fundamental questions about Mars and the possibility of life beyond Earth," said Thomas Zurbuchen, NASA's Associate Administrator for Science.

The Mars Sample Return mission, a joint effort between NASA and ESA, is planned for the early 2030s and will bring these precious samples back to Earth for detailed analysis.`,
    category: "Exploration",
    image: marsImage,
    author: "Lisa Park",
    date: "December 15, 2024",
    readTime: "5 min read",
  },
  {
    id: "6",
    slug: "starlink-global-coverage-milestone",
    title: "Starlink Achieves Global Coverage with 6,000th Satellite",
    excerpt: "SpaceX's internet constellation now provides connectivity to every continent including Antarctica.",
    content: `SpaceX has deployed its 6,000th Starlink satellite, completing the constellation's initial global coverage phase. The network now provides high-speed internet service to users on every continent, including research stations in Antarctica.

The achievement marks a major milestone in the company's mission to provide global broadband access. Starlink now serves over 3 million subscribers across 75 countries, with service quality continuing to improve as the constellation grows.

"We're just getting started," said Starlink's President Gwynne Shotwell. "The next phase will focus on direct-to-cell connectivity and enhanced enterprise services."

The company plans to launch an additional 12,000 satellites to increase bandwidth and reduce latency for users worldwide.`,
    category: "Commercial",
    image: satellitesImage,
    author: "David Kim",
    date: "December 14, 2024",
    readTime: "4 min read",
  },
];

export const getFeaturedArticle = () => articles.find(a => a.featured) || articles[0];

export const getArticlesByCategory = (category: Category) => 
  articles.filter(a => a.category === category);

export const getArticleBySlug = (slug: string) => 
  articles.find(a => a.slug === slug);

export const getLatestArticles = (count: number = 6) => 
  articles.slice(0, count);

export const getRelatedArticles = (currentSlug: string, count: number = 3) => 
  articles.filter(a => a.slug !== currentSlug).slice(0, count);
