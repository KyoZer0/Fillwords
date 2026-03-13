import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://fillwords.com';
  const now = new Date();

  // Static pages
  const staticPages = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/how-to-play', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/faq', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/blog', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.4, changeFrequency: 'yearly' as const },
    { path: '/parents', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/cookie-policy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/disclaimer', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/accessibility', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/sitemap-page', priority: 0.2, changeFrequency: 'monthly' as const },
    { path: '/play', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/play/arcade', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/play/game', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/play/game-arcade', priority: 0.8, changeFrequency: 'weekly' as const },
  ];

  // Blog posts
  const blogPosts = [
    { path: '/blog/a-parents-guide-to-using-word-games-for-kids-development', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/blog/benefits-of-puzzle-games', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/blog/best-puzzle-games-for-kids', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/blog/can-word-games-delay-cognitive-decline-what-the-research-says', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/blog/fillwords-vs-traditional-crosswords-which-is-better-for-your-brain', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/blog/history-of-puzzle-games', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/blog/how-playing-word-games-can-enhance-your-vocabulary', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/blog/how-to-beat-your-high-score-in-fillwords-every-time', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/blog/how-to-play-fillwords-a-beginners-guide-to-word-swiping', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/blog/how-word-games-help-with-stress-relief-and-mindfulness', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/blog/how-word-swipe-games-improve-cognitive-flexibility', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/blog/mindfulness-and-puzzles', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/blog/neuroscience-of-puzzle-solving', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/blog/pattern-recognition-skills', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/blog/puzzles-and-focus', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/blog/the-best-word-games-for-commuters-and-travelers', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/blog/the-evolution-of-word-puzzles-from-crosswords-to-fillwords', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/blog/the-hidden-benefits-of-spelling-and-word-games-for-adults', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/blog/the-link-between-word-puzzles-and-memory-improvement', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/blog/the-role-of-pattern-recognition-in-solving-word-puzzles', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/blog/the-science-behind-why-we-love-word-puzzles', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/blog/the-ultimate-strategy-guide-to-mastering-fillwords', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/blog/tips-and-tricks', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/blog/top-10-benefits-of-playing-word-puzzle-games-every-day', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/blog/understanding-the-psychology-of-puzzle-game-addiction', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/blog/what-is-fillwords', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/blog/why-fillwords-is-the-new-wordle-the-rise-of-swipe-puzzles', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/blog/why-fillwords-is-the-perfect-daily-brain-workout', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/blog/word-games-in-education-learning-through-play', priority: 0.6, changeFrequency: 'monthly' as const },
  ];

  const allPages = [...staticPages, ...blogPosts];

  return allPages.map(page => ({
    url: `${baseUrl}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
