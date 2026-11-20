import React from 'react';
import { AppPage } from '../core/types';
import { LandingHero } from '../components/LandingHero';
import { FeatureGrid } from '../components/FeatureGrid';

interface LandingPageProps {
  onNavigate: (page: AppPage) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <main className="flex-1 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full space-y-12">
      <LandingHero onNavigate={onNavigate} />
      <FeatureGrid onNavigate={onNavigate} />
    </main>
  );
};
