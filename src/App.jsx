import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';

import {
  Navbar,
  Hero,
  About,
  Tech,
  Experience,
  Works,
  Contact,
  StarsCanvas,
  MusicPlayer,
  LoadingScreen
} from './components';
import Footer from "./components/Footer";
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
import BlogEditor from './components/BlogEditor';
import Login from './components/Login';
import { AuthProvider } from './contexts/AuthContext';
import FeedbackForm from './components/FeedbackForm';
import RecruiterChat from './components/RecruiterChat';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const toastShown = React.useRef(false);

  useEffect(() => {
    // Show browser compatibility toast only once
    if (!toastShown.current) {
      toast('For best experience, please use Firefox if you encounter any issues in Chrome', {
        duration: 3000,
        icon: '🌐',
      });
      toastShown.current = true;
    }

    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className='relative z-0 bg-primary min-h-screen flex flex-col'>
          <MusicPlayer />
          <AnimatePresence mode="wait">
            {isLoading ? (
              <LoadingScreen key="loading" />
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full flex-grow"
              >
                <Routes>
                  <Route path="/" element={
                    <>
                      <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
                        <Navbar />
                        <Hero />
                      </div>
                      <About />
                      <Experience />
                      <Tech />
                      <Works />
                      <div className='relative z-0'>
                        <Contact />
                        <StarsCanvas />
                      </div>
                    </>
                  } />
                  <Route path="/blog" element={<BlogList />} />
                  <Route path="/blog/:id" element={<BlogPost />} />
                  <Route path="/blog/new" element={<BlogEditor />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/feedback" element={
                    <>
                      <Navbar />
                      <StarsCanvas />
                      <FeedbackForm />
                    </>
                  } />
                </Routes>
              </motion.div>
            )}
          </AnimatePresence>
          <RecruiterChat />
          <Footer />
        </div>
        <Toaster />
      </Router>
    </AuthProvider>
  );
};

export default App;
