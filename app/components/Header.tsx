'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const navLinks = [
  { href: '/how-to-play', label: 'Guide' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      if (wasOpenRef.current) {
        buttonRef.current?.focus();
      }
      wasOpenRef.current = false;
      return;
    }

    wasOpenRef.current = true;

    const firstLink = mobileNavRef.current?.querySelector<HTMLAnchorElement>('a');
    firstLink?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <nav className="island-nav" aria-label="Primary">
        <Link href="/" className="island-brand">
          FillWords
        </Link>

        <div className="island-links">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="island-link"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link href="/play" className="island-cta">
          Play Now
        </Link>

        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="island-menu-btn"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </nav>

      {isOpen && (
        <nav
          ref={mobileNavRef}
          id="mobile-navigation"
          className="island-mobile"
          aria-label="Mobile"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/play" onClick={() => setIsOpen(false)}>
            Play Now
          </Link>
        </nav>
      )}
    </>
  );
}
