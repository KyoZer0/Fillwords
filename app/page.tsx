import type { Metadata } from 'next';
import Link from 'next/link';
import AdSlot from './components/AdSlot';
import HeroSection from './components/HeroSection';

export const metadata: Metadata = {
  title: 'FillWords – The Classic Word Puzzle',
  description: 'Relax with FillWords, an elegant and free online word puzzle game inspired by classic newspaper puzzles.',
  keywords: ['FillWords', 'word puzzle', 'word search game', 'newspaper puzzle', 'free word game'],
};

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* ── Editorial Social Proof ── */}
      <section style={{
        padding: '2.5rem 0',
        borderTop: '2px solid var(--border)',
        borderBottom: '1px solid var(--border-light)',
        background: 'var(--bg-secondary)',
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '4rem',
          flexWrap: 'wrap',
        }}>
          {[
            { value: '500+', label: 'Curated Words' },
            { value: '13', label: 'Unique Themes' },
            { value: 'Daily', label: 'Brain Exercise' },
            { value: '100%', label: 'Subscriber Free' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.75rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontFamily: 'var(--font-sans)',
                marginTop: '0.2rem',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="container">
        <AdSlot type="banner" />
      </div>

      {/* ── Why Words Matter ── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              The Elegance of the Word Search
            </h2>
            <div style={{ width: '60px', height: '3px', background: 'var(--accent)', margin: '0 auto 1.5rem' }}></div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', fontFamily: 'var(--font-sans)', lineHeight: 1.8 }}>
              Inspired by the classic Sunday crossword and print word searches, FillWords brings the tactile satisfaction of connecting letters into the digital age.
            </p>
          </div>

          <div className="grid-3" style={{ gap: '2rem' }}>
            <article className="card feature-card" style={{ border: 'none', background: 'transparent', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--accent)' }}>✒️</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.75rem' }}>Intuitive Flow</h3>
              <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.05rem' }}>
                Simply drag your cursor or finger to connect adjacent letters. Watch the ink trail illuminate words instantly.
              </p>
            </article>

            <article className="card feature-card" style={{ border: 'none', background: 'transparent', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--accent)' }}>💡</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.75rem' }}>Subtle Hints</h3>
              <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.05rem' }}>
                Stuck on a tricky word? Wait 10 seconds for a gentle paper shake, revealing the starting letter to guide you forward.
              </p>
            </article>

            <article className="card feature-card" style={{ border: 'none', background: 'transparent', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--accent)' }}>🧠</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.75rem' }}>Mental Clarity</h3>
              <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.05rem' }}>
                Take a break from the noise. Our ad-light, minimalist interface is designed specifically to foster calm focus.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ── Latest on the Blog ── */}
      <section className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              From the Editor&apos;s Desk
            </h2>
            <Link href="/blog" style={{ color: 'var(--accent)', fontWeight: 600, fontFamily: 'var(--font-sans)', textDecoration: 'underline', textUnderlineOffset: '4px' }}>
              Read all articles &rarr;
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}>
            {[
              {
                slug: 'neuroscience-of-puzzle-solving',
                title: 'The Neuroscience of Puzzle Solving: What Happens in Your Brain',
                excerpt: 'Dopamine, neural plasticity, and the brain regions activated when you solve puzzles — the full breakdown.',
                date: 'February 24, 2026'
              },
              {
                slug: 'puzzles-and-focus',
                title: 'How Puzzles Improve Focus and Attention in the Digital Age',
                excerpt: 'Combat digital distraction and train sustained attention through puzzle solving, backed by research.',
                date: 'February 21, 2026'
              },
              {
                slug: 'pattern-recognition-skills',
                title: 'Pattern Recognition: The Hidden Skill Behind Every Great Puzzler',
                excerpt: 'How expert puzzlers develop visual pattern-matching skills and why this transfers to real life.',
                date: 'February 18, 2026'
              }
            ].map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                <article style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderTop: '4px solid var(--accent)',
                  padding: '1.75rem',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {post.date}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '1rem', lineHeight: 1.3 }}>
                    {post.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '1rem', lineHeight: 1.6, flexGrow: 1 }}>
                    {post.excerpt}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final Call ── */}
      <section style={{
        padding: '6rem 0',
        textAlign: 'center',
        background: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        backgroundImage: 'linear-gradient(rgba(45,42,38,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(45,42,38,0.02) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Your daily puzzle awaits
          </h2>
          <p style={{
            color: 'var(--text-secondary)',
            maxWidth: '450px',
            margin: '0 auto 2.5rem',
            fontSize: '1.1rem',
            fontFamily: 'var(--font-sans)',
            lineHeight: 1.7,
          }}>
            No subscription required. Scroll up to the front page and start finding words instantly.
          </p>
          <a href="#" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.05rem', fontFamily: 'var(--font-sans)', letterSpacing: '0.02em', textDecoration: 'none' }}>
            Return to Page One
          </a>
        </div>
      </section>
    </>
  );
}
