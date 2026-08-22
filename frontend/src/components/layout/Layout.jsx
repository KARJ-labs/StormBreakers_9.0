import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { FloatingRagAssistant } from '../rag/FloatingRagAssistant';
import { FinancialProfileModal } from '../modals/FinancialProfileModal';
import { useAuth } from '../../context/AuthContext';

export const Layout = ({ children }) => {
  const [isRagOpen, setIsRagOpen] = useState(false);
  const { isProfileModalOpen, closeFinancialProfileModal, refreshFinancialProfile } = useAuth();

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col selection:bg-brand-cyan/20 selection:text-brand-cyan relative">
      {/* Top sticky Navbar */}
      <Navbar onOpenRag={() => setIsRagOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      {/* Global Floating RAG Assistant (Backend 2 FastAPI) */}
      <FloatingRagAssistant
        isOpen={isRagOpen}
        onToggle={() => setIsRagOpen(!isRagOpen)}
      />

      {/* Global Financial Profile Modal */}
      <FinancialProfileModal
        isOpen={isProfileModalOpen}
        onClose={closeFinancialProfileModal}
        onSuccess={refreshFinancialProfile}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};
