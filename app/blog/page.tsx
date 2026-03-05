'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdSlot from '../components/AdSlot';

const posts = [
    {
        slug: 'the-ultimate-strategy-guide-to-mastering-fillwords',
        title: 'The Ultimate Strategy Guide to Mastering Fillwords',
        excerpt: 'Learn the best strategies, tips, and techniques to conquer FillWords. Discover how to identify patterns, use process of elimination, and build an unbeatable vocabulary.',
        icon: '🧠',
        date: 'March 10, 2026',
        readTime: '8 min read',
        category: 'Strategy',
    },
    {
        slug: 'how-word-swipe-games-improve-cognitive-flexibility',
        title: 'How Word Swipe Games Improve Cognitive Flexibility',
        excerpt: 'Explore the science behind cognitive flexibility and how playing word swipe games like FillWords can help keep your brain agile and adaptable.',
        icon: '🧗',
        date: 'March 11, 2026',
        readTime: '7 min read',
        category: 'Science',
    },
    {
        slug: 'the-evolution-of-word-puzzles-from-crosswords-to-fillwords',
        title: 'The Evolution of Word Puzzles: From Crosswords to Fillwords',
        excerpt: 'Trace the fascinating history of word games, beginning with the first crossword puzzles to the modern digital era of Fillwords and swipe mechanics.',
        icon: '📜',
        date: 'March 12, 2026',
        readTime: '9 min read',
        category: 'History',
    },
    {
        slug: 'why-fillwords-is-the-perfect-daily-brain-workout',
        title: 'Why Fillwords is the Perfect Daily Brain Workout',
        excerpt: 'Discover why playing FillWords daily provides a balanced, effective workout for your brain, improving memory, focus, and logic.',
        icon: '🏋️',
        date: 'March 13, 2026',
        readTime: '6 min read',
        category: 'Science',
    },
    {
        slug: 'top-10-benefits-of-playing-word-puzzle-games-every-day',
        title: 'Top 10 Benefits of Playing Word Puzzle Games Every Day',
        excerpt: 'Learn the surprising and science-backed top 10 benefits of playing word puzzle games daily, from improving memory to reducing stress.',
        icon: '📈',
        date: 'March 14, 2026',
        readTime: '8 min read',
        category: 'Science',
    },
    {
        slug: 'how-playing-word-games-can-enhance-your-vocabulary',
        title: 'How Playing Word Games Can Enhance Your Vocabulary',
        excerpt: 'Word games do more than test your knowledge—they actively build it. Discover the psychological mechanisms behind how puzzle games enhance your daily vocabulary.',
        icon: '📚',
        date: 'March 15, 2026',
        readTime: '7 min read',
        category: 'Education',
    },
    {
        slug: 'the-science-behind-why-we-love-word-puzzles',
        title: 'The Science Behind Why We Love Word Puzzles',
        excerpt: 'Ever wondered why humans are so obsessed with word puzzles? Delve into the evolutionary psychology and neuroscience that explains our love for logic and letters.',
        icon: '🧬',
        date: 'March 16, 2026',
        readTime: '10 min read',
        category: 'Science',
    },
    {
        slug: 'fillwords-vs-traditional-crosswords-which-is-better-for-your-brain',
        title: 'Fillwords vs. Traditional Crosswords: Which is Better for Your Brain?',
        excerpt: 'Compare the cognitive benefits of traditional crosswords with modern Fillwords. Discover which puzzle type is best suited for your specific brain training goals.',
        icon: '⚖️',
        date: 'March 17, 2026',
        readTime: '8 min read',
        category: 'Opinion',
    },
    {
        slug: 'how-word-games-help-with-stress-relief-and-mindfulness',
        title: 'How Word Games Help with Stress Relief and Mindfulness',
        excerpt: 'Explore the surprising psychological connection between word games, stress relief, and mindfulness meditation. Learn how puzzles create cognitive flow and calm anxiety.',
        icon: '🧘',
        date: 'March 18, 2026',
        readTime: '6 min read',
        category: 'Mental Health',
    },
    {
        slug: 'the-role-of-pattern-recognition-in-solving-word-puzzles',
        title: 'The Role of Pattern Recognition in Solving Word Puzzles',
        excerpt: 'Discover how your brain uses pattern recognition to solve complex word puzzles and why this crucial cognitive skill translates into real-world success.',
        icon: '🔎',
        date: 'March 19, 2026',
        readTime: '8 min read',
        category: 'Strategy',
    },
    {
        slug: 'can-word-games-delay-cognitive-decline-what-the-research-says',
        title: 'Can Word Games Delay Cognitive Decline? What the Research Says',
        excerpt: 'Explore the scientific consensus on whether playing word puzzles and brain games can actually prevent or delay dementia and Alzheimer\'s disease.',
        icon: '🛡️',
        date: 'March 20, 2026',
        readTime: '11 min read',
        category: 'Science',
    },
    {
        slug: 'a-parents-guide-to-using-word-games-for-kids-development',
        title: 'A Parents Guide to Using Word Games for Kids Development',
        excerpt: 'Learn how to harness word search and swipe puzzles to boost your child\'s spelling, reading comprehension, and problem-solving skills without the screen-time guilt.',
        icon: '👪',
        date: 'March 21, 2026',
        readTime: '7 min read',
        category: 'Family',
    },
    {
        slug: 'the-best-word-games-for-commuters-and-travelers',
        title: 'The Best Word Games for Commuters and Travelers',
        excerpt: 'Transform dead time into brain-training time. Discover why quick, offline-capable puzzle games like FillWords are the ultimate travel companion.',
        icon: '🚆',
        date: 'March 22, 2026',
        readTime: '6 min read',
        category: 'Lifestyle',
    },
    {
        slug: 'how-to-play-fillwords-a-beginners-guide-to-word-swiping',
        title: 'How to Play Fillwords: A Beginners Guide to Word Swiping',
        excerpt: 'A comprehensive beginner\'s guide on how to play Fillwords. Learn the rules, basic swiping mechanics, and foundational strategies to start solving puzzles.',
        icon: '🔰',
        date: 'March 23, 2026',
        readTime: '5 min read',
        category: 'Game Guide',
    },
    {
        slug: 'the-hidden-benefits-of-spelling-and-word-games-for-adults',
        title: 'The Hidden Benefits of Spelling and Word Games for Adults',
        excerpt: 'Word games aren\'t just for kids. Discover the hidden, adult-specific benefits of spelling puzzles, from professional communication to cognitive maintenance.',
        icon: '💼',
        date: 'March 24, 2026',
        readTime: '6 min read',
        category: 'Education',
    },
    {
        slug: 'understanding-the-psychology-of-puzzle-game-addiction',
        title: 'Understanding the Psychology of Puzzle Game Addiction',
        excerpt: 'Dive into the psychology of why puzzle games like FillWords are so addictive. Learn about the compulsion loop, dopamine rewards, and how to maintain healthy play habits.',
        icon: '🧬',
        date: 'March 25, 2026',
        readTime: '8 min read',
        category: 'Psychology',
    },
    {
        slug: 'how-to-beat-your-high-score-in-fillwords-every-time',
        title: 'How to Beat Your High Score in Fillwords Every Time',
        excerpt: 'Stop guessing and start strategizing. Master the mechanics of FillWords and learn the high-score strategies used by expert speed-solvers.',
        icon: '🏆',
        date: 'March 26, 2026',
        readTime: '7 min read',
        category: 'Strategy',
    },
    {
        slug: 'word-games-in-education-learning-through-play',
        title: 'Word Games in Education: Learning Through Play',
        excerpt: 'Why progressive educators are bringing word swipe games and puzzles into the classroom to teach spelling, vocabulary, and logic.',
        icon: '🏫',
        date: 'March 27, 2026',
        readTime: '6 min read',
        category: 'Education',
    },
    {
        slug: 'the-link-between-word-puzzles-and-memory-improvement',
        title: 'The Link Between Word Puzzles and Memory Improvement',
        excerpt: 'Explore the neurological connection between solving word puzzles and improving your short-term and working memory capacity.',
        icon: '🤔',
        date: 'March 28, 2026',
        readTime: '8 min read',
        category: 'Science',
    },
    {
        slug: 'why-fillwords-is-the-new-wordle-the-rise-of-swipe-puzzles',
        title: 'Why Fillwords is the New Wordle: The Rise of Swipe Puzzles',
        excerpt: 'Wordle captured the world, but FillWords is leading the next evolution of logic-based word games. Here is why swipe puzzles are the new king of daily web games.',
        icon: '👑',
        date: 'March 29, 2026',
        readTime: '6 min read',
        category: 'Opinion',
    },
    {
        slug: 'neuroscience-of-puzzle-solving',
        title: 'The Neuroscience of Puzzle Solving: What Happens in Your Brain',
        excerpt: 'Dopamine, neural plasticity, and the brain regions activated when you solve puzzles — the full neuroscience breakdown.',
        icon: '🔬',
        date: 'February 24, 2026',
        readTime: '10 min read',
        category: 'Science',
    },
    {
        slug: 'puzzles-and-focus',
        title: 'How Puzzles Improve Focus and Attention in the Digital Age',
        excerpt: 'Combat digital distraction and train sustained attention through puzzle solving, backed by attention research.',
        icon: '🎯',
        date: 'February 21, 2026',
        readTime: '9 min read',
        category: 'Science',
    },
    {
        slug: 'pattern-recognition-skills',
        title: 'Pattern Recognition: The Hidden Skill Behind Every Great Puzzler',
        excerpt: 'How expert puzzlers develop visual pattern-matching skills and why this ability transfers to real life.',
        icon: '👁️',
        date: 'February 18, 2026',
        readTime: '9 min read',
        category: 'Strategy',
    },
    {
        slug: 'mindfulness-and-puzzles',
        title: 'Mindfulness and Puzzles: How Games Create Flow States',
        excerpt: 'The deep connection between puzzles, mindfulness, and flow — active meditation through games.',
        icon: '🧘',
        date: 'February 12, 2026',
        readTime: '9 min read',
        category: 'Strategy',
    },
    {
        slug: 'what-is-fillwords',
        title: 'What is FillWords? The Ultimate Word Puzzle Experience',
        excerpt: 'Discover the game that blends the best of word search with strategic puzzle mechanics. Learn what makes FillWords unique and why players love it.',
        icon: '🧩',
        date: 'February 10, 2026',
        readTime: '5 min read',
        category: 'Game',
    },
    {
        slug: 'benefits-of-puzzle-games',
        title: '7 Brain Benefits of Playing Puzzle Games',
        excerpt: 'Science shows that puzzles improve memory, concentration, and problem-solving skills. Seven proven ways puzzles boost your brain.',
        icon: '🧠',
        date: 'February 8, 2026',
        readTime: '6 min read',
        category: 'Science',
    },
    {
        slug: 'tips-and-tricks',
        title: 'Pro Tips & Tricks to Master FillWords',
        excerpt: 'From corner strategies to move optimization, expert tips backed by cognitive science to solve puzzles faster.',
        icon: '💡',
        date: 'February 5, 2026',
        readTime: '7 min read',
        category: 'Strategy',
    },
    {
        slug: 'history-of-puzzle-games',
        title: 'The Fascinating History of Word Puzzles',
        excerpt: 'From 18th-century dissected maps to modern digital word searches, explore the rich history behind puzzle games.',
        icon: '📜',
        date: 'February 2, 2026',
        readTime: '8 min read',
        category: 'History',
    },
    {
        slug: 'best-puzzle-games-for-kids',
        title: 'Best Puzzle Games for Kids in 2026',
        excerpt: 'Educational and fun puzzle games curated for children, evaluated against AAP and research-backed safety and learning criteria.',
        icon: '👧',
        date: 'January 28, 2026',
        readTime: '6 min read',
        category: 'Family',
    },
];

// Sort by date (newest first)
const sortedPosts = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const allCategories = ['All', ...Array.from(new Set(posts.map(p => p.category)))];

export default function BlogPage() {
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredPosts = activeCategory === 'All'
        ? sortedPosts
        : sortedPosts.filter(p => p.category === activeCategory);

    return (
        <>
            <div className="page-header">
                <div className="container">
                    <h1 className="gradient-text">FillWords Blog</h1>
                    <p>Tips, insights, and stories from the world of puzzles.</p>
                </div>
            </div>

            <div className="container" style={{ maxWidth: '900px', padding: '0 1.5rem 4rem' }}>
                <AdSlot type="banner" />

                {/* Category filter tabs */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    marginTop: '2rem',
                    marginBottom: '1rem',
                }}>
                    {allCategories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            style={{
                                padding: '0.4rem 1rem',
                                borderRadius: 'var(--radius-xl)',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                background: activeCategory === cat ? 'var(--primary)' : 'rgba(108, 92, 231, 0.1)',
                                color: activeCategory === cat ? '#fff' : 'var(--primary-light)',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {filteredPosts.map((post, i) => (
                        <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                            <article className="card animate-in" style={{
                                animationDelay: `${0.1 + i * 0.05}s`,
                                display: 'flex',
                                gap: '1.5rem',
                                cursor: 'pointer',
                                alignItems: 'flex-start',
                            }}>
                                <div style={{
                                    fontSize: '2.5rem',
                                    flexShrink: 0,
                                    width: '80px',
                                    height: '80px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'rgba(108, 92, 231, 0.1)',
                                    borderRadius: 'var(--radius-md)',
                                }}>
                                    {post.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        display: 'flex',
                                        gap: '1rem',
                                        marginBottom: '0.5rem',
                                        fontSize: '0.8rem',
                                        color: 'var(--text-muted)',
                                    }}>
                                        <span style={{
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: 'var(--radius-xl)',
                                            background: 'rgba(108, 92, 231, 0.15)',
                                            color: 'var(--primary-light)',
                                            fontWeight: 600,
                                        }}>
                                            {post.category}
                                        </span>
                                        <span>{post.date}</span>
                                        <span>{post.readTime}</span>
                                    </div>
                                    <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text)' }}>
                                        {post.title}
                                    </h2>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0, lineHeight: 1.7 }}>
                                        {post.excerpt}
                                    </p>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>

                <AdSlot type="banner" />
            </div>
        </>
    );
}
