import React, { useEffect, useRef, useState } from 'react';
import { useDeviceType } from '../utils/useDeviceType';

/**
 * Big, joyful custom mouse cursor for children on desktop/laptop computers.
 * Automatically stays inactive on touchscreens (tablets/phones).
 * Morphs into a crayon over drawing canvases and bursts tiny stars on click.
 */
const CURSOR_SIZES = {
  normal: 56,
  large: 88,
  huge: 120
};

export default function KidCursor({ enabled = true, size = 'large' }) {
  const { isTouch } = useDeviceType();
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState('default'); // 'default' | 'pointer' | 'draw'
  const [pressed, setPressed] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const sparkleIdRef = useRef(0);

  const isActive = enabled && size !== 'off' && !isTouch;

  useEffect(() => {
    const root = document.documentElement;
    if (!isActive) {
      root.classList.remove('kid-cursor-active');
      return;
    }
    root.classList.add('kid-cursor-active');

    const handleMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);

      const target = e.target;
      if (target && target.closest) {
        if (target.closest('canvas')) {
          setMode('draw');
        } else if (
          target.closest('button, a, [role="button"], input, select, .cursor-pointer')
        ) {
          setMode('pointer');
        } else {
          setMode('default');
        }
      }
    };

    const handleDown = (e) => {
      setPressed(true);
      const id = ++sparkleIdRef.current;
      setSparkles((prev) => [...prev.slice(-4), { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== id));
      }, 520);
    };

    const handleUp = () => setPressed(false);
    const handleLeave = () => setVisible(false);
    const handleEnter = () => setVisible(true);

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);
    document.addEventListener('mouseleave', handleLeave);
    document.addEventListener('mouseenter', handleEnter);

    return () => {
      root.classList.remove('kid-cursor-active');
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
      document.removeEventListener('mouseleave', handleLeave);
      document.removeEventListener('mouseenter', handleEnter);
    };
  }, [isActive, visible]);

  if (!isActive || !visible) return null;

  const scale = pressed ? 0.85 : mode === 'pointer' ? 1.16 : 1;
  const px = CURSOR_SIZES[size] || CURSOR_SIZES.large;
  const tipOffset = Math.round((6 / 50) * px);

  return (
    <>
      {/* Click star-burst sparkles */}
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="fixed pointer-events-none z-[99998] animate-ping"
          style={{ left: s.x - 18, top: s.y - 18 }}
        >
          <span className="text-3xl select-none">✨</span>
        </div>
      ))}

      {/* Main Big Kid Cursor */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[99999] will-change-transform"
        style={{
          transform: `translate3d(${pos.x - tipOffset}px, ${pos.y - tipOffset}px, 0) scale(${scale})`,
          transformOrigin: `${tipOffset}px ${tipOffset}px`,
          transition: 'transform 110ms cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        {mode === 'draw' ? (
          /* Cute Big Crayon when drawing/tracing */
          <svg width={px} height={px} viewBox="0 0 48 48" fill="none" className="drop-shadow-lg">
            <path
              d="M6 6L18 10L40 32C42 34 42 37 40 39L39 40C37 42 34 42 32 40L10 18L6 6Z"
              fill="#F59E0B"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path d="M6 6L14 9L9 14L6 6Z" fill="#EC4899" />
            <path d="M16 14L34 32" stroke="#FEF3C7" strokeWidth="3" strokeLinecap="round" />
          </svg>
        ) : (
          /* Big Friendly Smiling Star-Wand Pointer */
          <svg width={px} height={px} viewBox="0 0 50 50" fill="none" className="drop-shadow-[0_6px_12px_rgba(79,70,229,0.4)]">
            {/* Pointer arrow tip at top-left (6,6) for accurate clicking */}
            <path
              d="M6 6L24 14L17 18L14 25L6 6Z"
              fill={mode === 'pointer' ? '#EC4899' : '#4F46E5'}
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Big smiling golden star attached to the pointer */}
            <path
              d="M31 15L34.3 21.8L41.8 22.9L36.4 28.1L37.7 35.6L31 32.1L24.3 35.6L25.6 28.1L20.2 22.9L27.7 21.8L31 15Z"
              fill="#FBBF24"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Cute eyes & smile on the star */}
            <circle cx="28.7" cy="25.5" r="1.2" fill="#1E293B" />
            <circle cx="33.3" cy="25.5" r="1.2" fill="#1E293B" />
            <path d="M29 28.2C30.2 29.5 31.8 29.5 33 28.2" stroke="#1E293B" strokeWidth="1.4" strokeLinecap="round" />
            {/* Little sparkle */}
            {mode === 'pointer' && (
              <circle cx="42" cy="14" r="3" fill="#34D399" stroke="#FFFFFF" strokeWidth="1.5" />
            )}
          </svg>
        )}
      </div>
    </>
  );
}
