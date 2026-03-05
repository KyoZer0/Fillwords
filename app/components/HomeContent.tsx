'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AdSlot from './AdSlot';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const FloatingTiles = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const ctx = gsap.context(() => {
            const tiles = gsap.utils.toArray('.bg-tile');
            tiles.forEach((tile: any, i) => {
                gsap.to(tile, {
                    y: 'random(-50, 50)',
                    x: 'random(-30, 30)',
                    rotation: 'random(-15, 15)',
                    ease: 'sine.inOut',
                    duration: 'random(4, 8)',
                    repeat: -1,
                    yoyo: true,
                    delay: i * 0.2
                });
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const letters = ['W', 'O', 'R', 'D', 'S', 'P', 'L', 'A', 'Y', 'F', 'U', 'N'];
    return (
        <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
            {letters.map((letter, i) => (
                <div key={i} className="bg-tile" style={{
                    position: 'absolute',
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    fontSize: '2rem',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    opacity: 0.05,
                    color: 'var(--text-primary)',
                    background: 'var(--bg-card)',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                    border: '1px solid var(--border-light)'
                }}>
                    {letter}
                </div>
            ))}
        </div>
    );
};

const VariantCard = ({ title, tagline, desc, icon, color, href, locked = false }: { title: string, tagline: string, desc: string, icon: React.ReactNode, color: string, href?: string | null, locked?: boolean }) => {
    const router = useRouter();
    return (
        <div className="stat-swipe-container variant-card" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1.25rem',
            background: locked ? 'var(--bg)' : 'var(--white)',
            border: `1px solid ${locked ? 'rgba(14,116,144,0.08)' : 'var(--border)'}`,
            borderRadius: '24px',
            padding: '2.5rem 2rem', width: '100%',
            position: 'relative', overflow: 'hidden', height: '100%',
            transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
            boxShadow: locked ? '0 2px 8px rgba(0,0,0,0.02)' : '0 4px 12px rgba(0, 0, 0, 0.02), inset 0 2px 10px rgba(255, 255, 255, 0.05)',
            isolation: 'isolate',
            cursor: locked ? 'default' : 'pointer',
            opacity: locked ? 0.6 : 1
        }}
            onClick={() => {
                if (!locked && href) {
                    router.push(href);
                }
            }}
            onMouseEnter={(e) => {
                if (locked) return;
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = color;
                e.currentTarget.style.boxShadow = `0 24px 48px ${color}20, inset 0 2px 10px rgba(255,255,255,0.1)`;
                const glow = e.currentTarget.querySelector('.card-glow') as HTMLElement;
                if (glow) glow.style.opacity = '1';
                const iconEl = e.currentTarget.querySelector('.card-icon') as HTMLElement;
                if (iconEl) iconEl.style.transform = 'scale(1.1) translateY(-4px)';
            }}
            onMouseLeave={(e) => {
                if (locked) return;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.02), inset 0 2px 10px rgba(255, 255, 255, 0.05)';
                const glow = e.currentTarget.querySelector('.card-glow') as HTMLElement;
                if (glow) glow.style.opacity = '0';
                const iconEl = e.currentTarget.querySelector('.card-icon') as HTMLElement;
                if (iconEl) iconEl.style.transform = 'scale(1) translateY(0)';
            }}
        >
            {/* Animated Glow effect */}
            {!locked && (
                <div className="card-glow" style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: `radial-gradient(circle at 100% 0%, ${color}15 0%, transparent 70%)`,
                    opacity: 0,
                    transition: 'opacity 0.6s ease',
                    zIndex: -1,
                    pointerEvents: 'none'
                }} />
            )}

            {locked && (
                <div style={{
                    position: 'absolute', top: '1.5rem', right: '1.5rem',
                    fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    background: 'var(--bg)', padding: '0.3rem 0.8rem', borderRadius: '99px',
                    border: '1px solid var(--border-light)'
                }}>
                    Coming Soon
                </div>
            )}

            <div className="card-icon" style={{
                width: '56px', height: '56px', borderRadius: '16px',
                background: locked ? 'var(--bg)' : `${color}15`,
                color: locked ? 'var(--text-muted)' : color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                filter: locked ? 'none' : `drop-shadow(0 8px 16px ${color}30)`,
                transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}>
                {icon}
            </div>

            <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
                    {title}
                </h3>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: locked ? 'var(--text-muted)' : color, marginBottom: '1rem' }}>
                    {tagline}
                </div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, flexGrow: 1 }}>
                    {desc}
                </p>

                <div style={{ marginTop: '2rem', display: 'flex' }}>
                    {locked ? (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            Locked
                        </div>
                    ) : (
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                            background: color, color: '#fff', padding: '0.6rem 1.4rem', borderRadius: '99px',
                            fontSize: '0.9rem', fontWeight: 700, fontFamily: 'var(--font-sans)',
                            boxShadow: `0 4px 12px ${color}40`,
                            transition: 'all 0.2s'
                        }}>
                            Play Now
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14" /><polyline points="12 5 19 12 12 19" />
                            </svg>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ArcadeVariantCard = ({ title, tagline, desc, icon, color, href }: { title: string, tagline: string, desc: string, icon: React.ReactNode, color: string, href?: string | null }) => {
    const router = useRouter();
    return (
        <div className="stat-swipe-container variant-card arcade-card" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1.25rem',
            background: 'var(--white)',
            border: `1px solid rgba(173, 40, 211, 0.15)`,
            borderRadius: '24px',
            padding: '2.5rem 2rem', width: '100%',
            position: 'relative', overflow: 'hidden', height: '100%',
            transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
            boxShadow: `0 8px 32px rgba(173, 40, 211, 0.08), inset 0 2px 10px rgba(255, 255, 255, 0.5)`,
            isolation: 'isolate',
            cursor: 'pointer',
            perspective: '1000px'
        }}
            onClick={() => {
                if (href) router.push(href);
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-12px) rotateX(4deg)';
                e.currentTarget.style.borderColor = 'rgba(173, 40, 211, 0.4)';
                e.currentTarget.style.boxShadow = `0 32px 64px rgba(173, 40, 211, 0.15), inset 0 2px 20px rgba(255,255,255,0.8), 0 0 20px rgba(255, 215, 0, 0.15)`;

                const elements = e.currentTarget.querySelectorAll('.arcade-float');
                elements.forEach((el, index) => {
                    const htmlEl = el as HTMLElement;
                    htmlEl.style.transform = `translateZ(${30 + index * 20}px) translateY(-15px) rotate(${index % 2 === 0 ? '15deg' : '-15deg'}) scale(1.2)`;
                    htmlEl.style.filter = `drop-shadow(0 15px 20px rgba(0,0,0,0.15))`;
                });

                const iconEl = e.currentTarget.querySelector('.card-icon') as HTMLElement;
                if (iconEl) iconEl.style.transform = 'scale(1.1) translateZ(40px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) rotateX(0)';
                e.currentTarget.style.borderColor = `rgba(173, 40, 211, 0.15)`;
                e.currentTarget.style.boxShadow = `0 8px 32px rgba(173, 40, 211, 0.08), inset 0 2px 10px rgba(255, 255, 255, 0.5)`;

                const elements = e.currentTarget.querySelectorAll('.arcade-float');
                elements.forEach((el) => {
                    const htmlEl = el as HTMLElement;
                    htmlEl.style.transform = `translateZ(0) translateY(0) rotate(0) scale(1)`;
                    htmlEl.style.filter = `drop-shadow(0 4px 8px rgba(0,0,0,0.06))`;
                });

                const iconEl = e.currentTarget.querySelector('.card-icon') as HTMLElement;
                if (iconEl) iconEl.style.transform = 'scale(1) translateZ(0)';
            }}
        >
            {/* 3D Floating Elements */}
            <div className="arcade-float" style={{
                position: 'absolute', top: '15%', right: '10%',
                width: '40px', height: '40px', borderRadius: '8px',
                background: 'linear-gradient(135deg, #FFD700, #ffb300)', // Yellow
                transformStyle: 'preserve-3d',
                transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                zIndex: 0, opacity: 0.8,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.06))',
                transform: 'rotate(15deg)'
            }}>
                <div style={{ position: 'absolute', inset: 0, border: '2px solid rgba(255,255,255,0.4)', borderRadius: '8px', transform: 'translateZ(10px)' }} />
            </div>

            <div className="arcade-float" style={{
                position: 'absolute', bottom: '25%', right: '-5%',
                width: '60px', height: '60px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #ef4444, #b91c1c)', // Red
                transformStyle: 'preserve-3d',
                transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s',
                zIndex: 0, opacity: 0.6,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.06))',
            }}>
                <div style={{ position: 'absolute', top: '15%', left: '15%', width: '30%', height: '30%', background: 'rgba(255,255,255,0.4)', borderRadius: '50%', transform: 'translateZ(15px)' }} />
            </div>

            <div className="arcade-float" style={{
                position: 'absolute', top: '-10%', left: '50%',
                width: '80px', height: '30px', borderRadius: '15px',
                background: 'linear-gradient(135deg, #ad28d3, #7e22ce)', // Purple
                transformStyle: 'preserve-3d',
                transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.05s',
                zIndex: 0, opacity: 0.4,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.06))',
                transform: 'rotate(-25deg)'
            }} />


            <div className="card-icon" style={{
                width: '56px', height: '56px', borderRadius: '16px',
                background: `linear-gradient(135deg, rgba(173, 40, 211, 0.1), rgba(173, 40, 211, 0.2))`,
                color: '#ad28d3',
                border: `1px solid rgba(173, 40, 211, 0.3)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 8px 16px rgba(173, 40, 211, 0.15), inset 0 2px 6px rgba(255,255,255,0.8)`,
                transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transformStyle: 'preserve-3d'
            }}>
                {icon}
            </div>

            <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', height: '100%', transformStyle: 'preserve-3d' }}>
                <h3 style={{ fontFamily: 'var(--font-arcade), var(--font-display)', fontSize: '1.9rem', fontWeight: 400, color: 'var(--text-primary)', marginBottom: '0.25rem', letterSpacing: '0.02em' }}>
                    {title}
                </h3>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ad28d3', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {tagline}
                </div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, flexGrow: 1 }}>
                    {desc}
                </p>

                <div style={{ marginTop: '2rem', display: 'flex' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        background: 'linear-gradient(135deg, #FFD700, #ffb300)', // Yellow button
                        color: '#000', padding: '0.6rem 1.6rem', borderRadius: '99px',
                        border: `none`,
                        fontSize: '0.9rem', fontWeight: 400, fontFamily: 'var(--font-arcade), var(--font-sans)',
                        boxShadow: `0 6px 16px rgba(255, 215, 0, 0.4), inset 0 -3px 0 rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.5)`,
                        transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        transform: 'translateZ(20px)'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateZ(30px) translateY(-2px) scale(1.05)';
                            e.currentTarget.style.boxShadow = `0 10px 24px rgba(255, 215, 0, 0.5), inset 0 -3px 0 rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.6)`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateZ(20px) translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = `0 6px 16px rgba(255, 215, 0, 0.4), inset 0 -3px 0 rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.5)`;
                        }}
                    >
                        Play Now
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14" /><polyline points="12 5 19 12 12 19" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Tile = ({ char, yellow = false }: { char: string, yellow?: boolean }) => (
    <div className="stat-tile" style={{
        width: 'clamp(2.2rem, 8vw, 3.5rem)',
        height: 'clamp(2.2rem, 8vw, 3.5rem)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: yellow ? 'var(--accent)' : 'var(--bg-card)',
        color: yellow ? '#000' : 'var(--text-primary)',
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(1.2rem, 5vw, 2rem)',
        fontWeight: 800,
        borderRadius: '8px',
        boxShadow: yellow ? '0 4px 12px rgba(201, 163, 0, 0.3), 0 4px 0 #c9a300' : '0 4px 12px rgba(14, 116, 144, 0.06), 0 4px 0 rgba(14, 116, 144, 0.1)',
        border: yellow ? '2px solid #e5b900' : '2px solid rgba(14, 116, 144, 0.1)',
        position: 'relative',
        textTransform: 'uppercase'
    }}>
        {char}
        {!yellow && /[A-Z]/.test(char) && (
            <span style={{ position: 'absolute', bottom: '2px', right: '4px', fontSize: 'clamp(0.45rem, 2vw, 0.65rem)', fontWeight: 600, color: 'var(--text-muted)' }}>
                {{ 'A': 1, 'B': 3, 'C': 3, 'D': 2, 'E': 1, 'F': 4, 'G': 2, 'H': 4, 'I': 1, 'J': 8, 'K': 5, 'L': 1, 'M': 3, 'N': 1, 'O': 1, 'P': 3, 'Q': 10, 'R': 1, 'S': 1, 'T': 1, 'U': 1, 'V': 4, 'W': 4, 'X': 8, 'Y': 4, 'Z': 10 }[char as string] || 1}
            </span>
        )}
    </div>
);

export default function HomeContent() {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Stats Animation Setup (Removed specific SwipeStat animations, ThemeCard handles its own hover)
            gsap.utils.toArray('.stat-swipe-container').forEach((container: any, i) => {
                gsap.fromTo(container,
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: i * 0.1,
                        scrollTrigger: {
                            trigger: container,
                            start: 'top 95%',
                        }
                    }
                );
            });

            // Features Animation
            gsap.utils.toArray('.feature-card').forEach((card: any) => {
                gsap.fromTo(card,
                    { y: 50, opacity: 0 },
                    {
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 95%',
                        },
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: 'power3.out'
                    }
                );
            });

            // Swipe lines animation in Features
            gsap.utils.toArray('.swipe-line').forEach((line: any) => {
                gsap.fromTo(line,
                    { scaleX: 0, transformOrigin: 'left center' },
                    {
                        scrollTrigger: {
                            trigger: line,
                            start: 'top 95%',
                        },
                        scaleX: 1,
                        duration: 0.6,
                        delay: 0.2, // let element appear first
                        ease: 'power2.out'
                    }
                );
            });

            // Blog Cards Animation
            gsap.utils.toArray('.blog-card').forEach((card: any) => {
                gsap.fromTo(card,
                    { scale: 0.95, opacity: 0, y: 30 },
                    {
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 95%',
                        },
                        scale: 1,
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: 'power2.out'
                    }
                );
            });

            // Force refresh in case layout shifts
            setTimeout(() => ScrollTrigger.refresh(), 500);

        }, wrapperRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={wrapperRef} style={{ position: 'relative' }}>
            <FloatingTiles />

            {/* ── Game Variants ── */}
            <section className="section features-section" style={{ position: 'relative', zIndex: 1, padding: '4rem 0' }}>
                <div className="container">
                    <div className="feature-card" style={{
                        background: 'var(--bg)',
                        border: '1px solid var(--border)',
                        borderRadius: '24px',
                        padding: '2.5rem',
                        position: 'relative',
                        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)'
                    }}>
                        <div style={{
                            position: 'absolute', top: '-1rem', left: '2rem',
                            background: '#0e7490', color: 'white', padding: '0.4rem 1rem', borderRadius: '99px',
                            fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase'
                        }}>
                            Play Modes
                        </div>

                        <div style={{ marginBottom: '2.5rem' }}>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                Choose a Game Mode
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px', fontFamily: 'var(--font-sans)', lineHeight: 1.6 }}>
                                Start with the classic, or unlock new challenges as they arrive.
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', justifyItems: 'stretch' }}>
                            <VariantCard
                                title="FillWords"
                                tagline="The simple and fun version"
                                desc="Swipe through a letter grid to find all hidden words. 3 categories, 15 levels, unlimited fun."
                                icon={
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="7" height="7" rx="1.5" />
                                        <rect x="14" y="3" width="7" height="7" rx="1.5" />
                                        <rect x="3" y="14" width="7" height="7" rx="1.5" />
                                        <rect x="14" y="14" width="7" height="7" rx="1.5" />
                                        <path d="M6.5 6.5h0M17.5 6.5h0M6.5 17.5h0M17.5 17.5h0" strokeWidth="2.5" />
                                    </svg>
                                }
                                color="#0e7490"
                                href="/play/game"
                            />
                            <ArcadeVariantCard
                                title="FillWords Extra"
                                tagline="Want more challenge, more fun? Try FillWords Extra!"
                                desc="Harder puzzles with bonus word chains, time challenges, arcade vibes, and more."
                                icon={
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                    </svg>
                                }
                                color="#0e7490"
                                href="/play/arcade"
                            />
                            <VariantCard
                                title="FillWords Classic"
                                tagline="The original word puzzle"
                                desc="Experience the original FillWords puzzle, the one that started it all."
                                icon={
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 7 7 7" />
                                        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 17 7 17 7" />
                                        <path d="M4 22h16" />
                                        <path d="M10 22V8a6 6 0 0 0-6-1v6c0 5.523 2.477 9 8 9Z" />
                                        <path d="M14 22V8a6 6 0 0 1 6-1v6c0 5.523-2.477 9-8 9Z" />
                                    </svg>
                                }
                                color="#8b5cf6"
                                href={null}
                                locked={true}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <div className="container" style={{ position: 'relative', zIndex: 1, padding: '1.5rem 0' }}>
                <AdSlot type="banner" />
            </div>

            {/* ── Why Words Matter AND How to Play ── */}
            <section className="section features-section" style={{ position: 'relative', zIndex: 1, padding: '4rem 0' }}>
                <div className="container">

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)', gap: '4rem', alignItems: 'start' }}>

                        {/* Features Grid - Denser */}
                        <div>
                            <div style={{
                                background: 'var(--bg)',
                                border: '1px solid var(--border)',
                                borderRadius: '24px',
                                padding: '2.5rem',
                                position: 'relative',
                                boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)',
                                marginBottom: '2rem'
                            }}>
                                <h2 style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '2.5rem',
                                    fontWeight: 800,
                                    marginBottom: '0.5rem',
                                    color: 'var(--text-primary)',
                                    display: 'inline-block',
                                    position: 'relative'
                                }}>
                                    The Elegance of the Word Search
                                    <div className="swipe-line" style={{
                                        position: 'absolute', bottom: '8px', left: '-5%', width: '110%', height: '12px',
                                        background: 'rgba(255, 215, 0, 0.4)', borderRadius: '8px', zIndex: -1
                                    }}></div>
                                </h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0.5rem 0 0', fontFamily: 'var(--font-sans)', lineHeight: 1.6 }}>
                                    Inspired by the classic Sunday crossword and print word searches, FillWords brings the tactile satisfaction of connecting letters into the digital age.
                                </p>
                            </div>

                            <div className="feature-card" style={{
                                background: 'var(--bg)',
                                border: '1px solid var(--border)',
                                borderRadius: '24px',
                                padding: '2rem',
                                position: 'relative',
                                boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)'
                            }}>
                                <div style={{
                                    position: 'absolute', top: '-1rem', left: '2rem',
                                    background: 'var(--accent)', color: '#000', padding: '0.4rem 1rem', borderRadius: '99px',
                                    fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase'
                                }}>
                                    Experience
                                </div>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
                                    Minimalist & Elegant
                                </h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {[
                                        { icon: '✒️', title: 'Intuitive Flow', desc: 'Drag your cursor to connect adjacent letters. Watch the ink trail illuminate words instantly with deeply satisfying feedback.' },
                                        { icon: '💡', title: 'Subtle Guiding Hints', desc: 'Stuck on a tricky word? Wait 10 seconds for a gentle paper shake to reveal starting letters to guide you.' },
                                        { icon: '🧠', title: 'Mental Clarity', desc: 'Our ad-light, minimalist interface is designed specifically to foster calm, distraction-free focus.' }
                                    ].map((step, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                                            <div style={{ fontSize: '1.5rem', marginTop: '0.1rem' }}>
                                                {step.icon}
                                            </div>
                                            <div>
                                                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                                                    {step.title}
                                                </h4>
                                                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                                                    {step.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* How to Play - SEO Content */}
                        <div className="feature-card" style={{
                            background: 'var(--bg)',
                            border: '1px solid var(--border)',
                            borderRadius: '24px',
                            padding: '2.5rem',
                            position: 'relative',
                            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)'
                        }}>
                            <div style={{
                                position: 'absolute', top: '-1rem', left: '2rem',
                                background: '#0e7490', color: 'white', padding: '0.4rem 1rem', borderRadius: '99px',
                                fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase'
                            }}>
                                Rulebook
                            </div>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
                                How to Play FillWords
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {[
                                    { title: 'Find the Theme', desc: 'Each puzzle has a unique theme. Look at the title to get a clue about what words to search for.' },
                                    { title: 'Swipe to Connect', desc: 'Find words hidden in the grid. Click and drag (or swipe on mobile) across adjacent letters to form the word.' },
                                    { title: 'Any Direction', desc: 'Words can be formed horizontally, vertically, or diagonally. Letters can even snake around!' },
                                    { title: 'Fill the Board', desc: 'Every single letter on the board belongs to a word. Your goal is to fill the entire board and leave no letter unused.' }
                                ].map((step, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                        <div style={{
                                            flexShrink: 0, width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)',
                                            fontWeight: 800, fontSize: '0.9rem', color: '#000', marginTop: '0.2rem'
                                        }}>
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                                                {step.title}
                                            </h4>
                                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                                                {step.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px dashed var(--border)', textAlign: 'center' }}>
                                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
                                    "It's like uncovering a hidden message, one swipe at a time."
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ── Latest on the Blog ── */}
            <section className="section blog-section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', position: 'relative', zIndex: 1, padding: '4rem 0' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', position: 'relative' }}>
                            From the Editor's Desk
                            <div className="swipe-line" style={{
                                position: 'absolute', bottom: '8px', left: '-2%', width: '104%', height: '10px', background: 'rgba(14, 116, 144, 0.2)', borderRadius: '4px', zIndex: -1
                            }}></div>
                        </h2>
                        <Link href="/blog" className="blog-link" style={{
                            color: '#0e7490',
                            fontWeight: 700,
                            fontFamily: 'var(--font-sans)',
                            textDecoration: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '99px',
                            background: 'rgba(14, 116, 144, 0.1)',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(14, 116, 144, 0.2)';
                                e.currentTarget.style.transform = 'translateX(5px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(14, 116, 144, 0.1)';
                                e.currentTarget.style.transform = 'translateX(0)';
                            }}
                        >
                            Read all articles <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                        </Link>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
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
                                <article className="blog-card" style={{
                                    background: 'var(--bg-card)',
                                    border: '2px solid var(--border)',
                                    borderRadius: '16px',
                                    padding: '2rem',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(14,116,144,0.1)';
                                        e.currentTarget.style.borderColor = 'var(--accent)';
                                        const highlight = e.currentTarget.querySelector('.title-highlight');
                                        if (highlight) (highlight as HTMLElement).style.width = '100%';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                        e.currentTarget.style.boxShadow = 'none';
                                        e.currentTarget.style.borderColor = 'var(--border)';
                                        const highlight = e.currentTarget.querySelector('.title-highlight');
                                        if (highlight) (highlight as HTMLElement).style.width = '0%';
                                    }}
                                >
                                    <div style={{ fontSize: '0.85rem', color: '#0e7490', fontWeight: 700, marginBottom: '1rem', fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {post.date}
                                    </div>
                                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1.25rem', lineHeight: 1.4, position: 'relative', display: 'inline-block' }}>
                                        {post.title}
                                        <span className="title-highlight" style={{
                                            position: 'absolute', left: 0, bottom: '2px', height: '40%', width: '0%',
                                            background: 'rgba(255, 215, 0, 0.3)', zIndex: -1, transition: 'width 0.4s ease', borderRadius: '2px'
                                        }}></span>
                                    </h3>
                                    <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '1.05rem', lineHeight: 1.6, flexGrow: 1 }}>
                                        {post.excerpt}
                                    </p>

                                    <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                                        Read Article <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                                    </div>
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
                backgroundImage: 'linear-gradient(rgba(14,116,144,0.03) 2px, transparent 2px), linear-gradient(90deg, rgba(14,116,144,0.03) 2px, transparent 2px)',
                backgroundSize: '40px 40px',
                position: 'relative',
                zIndex: 1
            }}>
                <div className="container" style={{ position: 'relative' }}>
                    <div style={{
                        position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)',
                        background: 'var(--accent)', color: '#000', padding: '0.5rem 1.5rem', borderRadius: '99px',
                        fontFamily: 'var(--font-display)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                        Ready to Play?
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)', fontWeight: 800 }}>
                        Your daily puzzle awaits
                    </h2>
                    <p style={{
                        color: 'var(--text-secondary)',
                        maxWidth: '500px',
                        margin: '0 auto 3rem',
                        fontSize: '1.2rem',
                        fontFamily: 'var(--font-sans)',
                        lineHeight: 1.7,
                    }}>
                        No subscription required. Scroll up to the front page and start finding words instantly.
                    </p>
                    <a href="#game" className="btn btn-primary" style={{
                        padding: '1.25rem 3rem',
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        fontFamily: 'var(--font-display)',
                        letterSpacing: '0.02em',
                        textDecoration: 'none',
                        borderRadius: '99px',
                        background: '#0e7490',
                        color: '#fff',
                        boxShadow: '0 6px 20px rgba(14,116,144,0.3), 0 4px 0 #084c61',
                        transition: 'all 0.2s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(14,116,144,0.4), 0 6px 0 #084c61';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(14,116,144,0.3), 0 4px 0 #084c61';
                            e.currentTarget.style.background = '#0e7490';
                        }}
                        onMouseDown={(e) => {
                            e.currentTarget.style.transform = 'translateY(4px)';
                            e.currentTarget.style.boxShadow = '0 0px 0 #084c61';
                            e.currentTarget.style.background = '#0b5a70';
                        }}
                        onMouseUp={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(14,116,144,0.4), 0 6px 0 #084c61';
                            e.currentTarget.style.background = '#0e7490';
                        }}
                    >
                        Start Playing <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14m-7-7l7-7 7 7" /></svg>
                    </a>
                </div>
            </section>
        </div>
    );
}
