import { useState } from 'react';
import Navigation from './Navigation';

/**
 * Layout component that provides the main structure for all pages
 * 
 * Features:
 * - Responsive navigation header
 * - Main content area with proper spacing
 * - Mobile-friendly hamburger menu
 * - Consistent styling across all pages
 */
function Layout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              Algorithm Visualizer - Interactive Learning Platform
            </p>
            <p className="text-sm">
              Built with React, Tailwind CSS, and modern web technologies
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
