import confetti from 'canvas-confetti';

export const triggerConfetti = (origin = { x: 0.5, y: 0.6 }) => {
  try {
    confetti({
      particleCount: 50,
      spread: 70,
      origin,
      colors: ['#F59E0B', '#EC4899', '#3B82F6', '#10B981', '#8B5CF6'],
      ticks: 200,
      shapes: ['circle', 'square']
    });
  } catch (err) {
    console.log('Confetti triggered', err);
  }
};

export const triggerStarBurst = (origin = { x: 0.5, y: 0.5 }) => {
  try {
    confetti({
      particleCount: 80,
      spread: 90,
      origin,
      colors: ['#FBBF24', '#F59E0B', '#EF4444', '#10B981'],
      scalar: 1.2
    });
  } catch (err) {
    console.log('Star burst triggered', err);
  }
};
