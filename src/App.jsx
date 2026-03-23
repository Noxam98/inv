import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { theme } from './theme';
import GlobalStyles from './GlobalStyles';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import InvestPage from './pages/InvestPage';
import AboutPage from './pages/AboutPage';
import ChatPage from './pages/ChatPage';
import BlogPage from './pages/BlogPage';
import ProfilePage from './pages/ProfilePage';
import VideoPage from './pages/VideoPage';
import useLenis from './hooks/useLenis';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25 } },
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/invest" element={<InvestPage />} />
          <Route path="/about-us" element={<AboutPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/video/:id" element={<VideoPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  useLenis();

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Navbar />
        <main>
          <AnimatedRoutes />
        </main>
        <Footer />
      </ThemeProvider>
    </BrowserRouter>
  );
}
