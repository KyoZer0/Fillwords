export default function PlayGamePage() {
    return (
        <>
            <style>{`
                .island-nav, .island-mobile, footer, .site-footer { display: none !important; }
                main { padding: 0 !important; }
            `}</style>
            <iframe
                src="/game-arcade/index.html"
                style={{
                    width: '100%',
                    height: '100dvh',
                    border: 'none',
                    display: 'block',
                }}
                title="FillWords Arcade"
                allow="autoplay"
                loading="eager"
            />
        </>
    );
}
