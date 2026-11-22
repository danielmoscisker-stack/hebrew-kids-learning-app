import { useState, useEffect } from 'react';

/**
 * Detects whether the child is playing on a desktop/laptop with a mouse
 * or on a touchscreen device (mobile / tablet / iPad) with their finger.
 */
export function useDeviceType() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      // Check for touch capability and coarse pointer (phone / tablet)
      const hasTouchScreen =
        ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);

      setIsTouch(Boolean(hasTouchScreen));
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return {
    isTouch,
    isMouse: !isTouch,
    deviceWordHe: isTouch ? 'אֶצְבַּע' : 'עַכְבָּר',
    deviceWordEn: isTouch ? 'finger' : 'mouse',
    withDeviceHe: isTouch ? 'עִם הָאֶצְבַּע' : 'עִם הָעַכְבָּר',
    withDeviceEn: isTouch ? 'with your finger' : 'with the mouse'
  };
}
