import type { Metadata } from 'next';
import HeroSection from './components/HeroSection';
import HomeContent from './components/HomeContent';

export const metadata: Metadata = {
  title: 'FillWords – The Classic Word Puzzle',
  description: 'Relax with FillWords, an elegant and free online word puzzle game inspired by classic newspaper puzzles.',
  keywords: ['FillWords', 'word puzzle', 'word search game', 'newspaper puzzle', 'free word game'],
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <HomeContent />
    </>
  );
}
