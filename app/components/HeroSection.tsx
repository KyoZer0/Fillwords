'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

export default function HeroSection() {
    const heroRef = useRef<HTMLElement>(null);
    const headlineRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const gameRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.fromTo(
                badgeRef.current,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.8 }
            );

            tl.fromTo(
                headlineRef.current,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.8 },
                '-=0.6'
            );

            tl.fromTo(
                subtitleRef.current,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.8 },
                '-=0.6'
            );

            tl.fromTo(
                gameRef.current,
                { opacity: 0, y: 20, scale: 0.98 },
                { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.1)' },
                '-=0.4'
            );
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="hero hero-full hero-with-game" ref={heroRef} id="game">
            {/* ── Grid pattern overlay ── */}
            <div className="hero-grid-overlay" />

            {/* ── Content ── */}
            <div className="container hero-content" style={{ maxWidth: '1000px' }}>
                <p className="hero-badge" ref={badgeRef}>
                    <span className="hero-badge-dot" style={{ background: 'var(--accent)', boxShadow: 'none' }} />
                    The Daily Puzzle
                </p>

                <h1 ref={headlineRef} style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                    FillWords: The Classic Print Game, Now Digital
                </h1>

                <p className="hero-subtitle" ref={subtitleRef}>
                    Slide your pen—or your finger—across the grid to discover hidden words. A daily ritual of logic and vocabulary, free for everyone.
                </p>

                {/* ── Embedded Game ── */}
                <div
                    className="hero-game-wrapper"
                    ref={gameRef}
                    style={{
                        width: '100%',
                        maxWidth: '960px',
                        background: '#f0f7fa',
                        border: '2px solid rgba(14, 116, 144, 0.25)',
                        borderRadius: '16px',
                        boxShadow: '0 8px 32px rgba(14, 116, 144, 0.12), 0 4px 0 rgba(14, 116, 144, 0.1)',
                        margin: '0 auto',
                        overflow: 'hidden',
                    }}
                >
                    <iframe
                        src="/game/index.html"
                        title="FillWords Game"
                        className="hero-game-iframe"
                        allow="autoplay"
                        loading="eager"
                        scrolling="no"
                        style={{ borderRadius: '14px' }}
                    />
                </div>

                {/* ── Action buttons ── */}
                <div className="hero-cta" style={{
                    marginTop: '1.25rem',
                    display: 'flex',
                    gap: '0.75rem',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Link href="/play/game" className="btn btn-hero" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.65rem 1.5rem',
                        background: 'var(--accent)',
                        color: '#0e7490',
                        borderRadius: '9999px',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        fontFamily: 'var(--font-display)',
                        border: 'none',
                        textDecoration: 'none',
                        boxShadow: '0 3px 0 #c9a300',
                        transition: 'all 0.2s',
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" /></svg>
                        Fullscreen
                    </Link>
                    <button onClick={() => {
                        const url = 'https://fillwords.com';
                        if (navigator.share) {
                            navigator.share({ title: 'FillWords', text: 'Play FillWords – the daily word puzzle!', url });
                        } else {
                            navigator.clipboard.writeText(url);
                            const btn = document.querySelector('.share-btn-hero') as HTMLButtonElement;
                            if (btn) { btn.textContent = '✓ Copied!'; setTimeout(() => btn.textContent = 'Share', 2000); }
                        }
                    }} className="btn btn-secondary btn-hero share-btn-hero" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.65rem 1.5rem',
                        background: 'white',
                        color: 'var(--text-secondary)',
                        borderRadius: '9999px',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        fontFamily: 'var(--font-display)',
                        border: '2px solid var(--border)',
                        cursor: 'pointer',
                        boxShadow: '0 2px 0 rgba(14,116,144,0.08)',
                        transition: 'all 0.2s',
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
                        Share
                    </button>
                </div>
            </div>
        </section>
    );
}
