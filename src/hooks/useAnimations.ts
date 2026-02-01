import { useCallback, useRef } from 'react';

type AnimationCallbacks = {
  startAnimation: (type: 'rotating' | 'falling' | 'clearing') => void;
  endAnimation: (type: 'rotating' | 'falling' | 'clearing') => void;
};

// Animation durations in milliseconds
export const ANIMATION_DURATIONS = {
  rotation: 300,
  falling: 200,
  clearing: 300,
};

export function useAnimations({ startAnimation, endAnimation }: AnimationCallbacks) {
  const animationTimeoutRef = useRef<number | null>(null);

  // Run an animation with a callback when complete
  const runAnimation = useCallback((
    type: 'rotating' | 'falling' | 'clearing',
    onComplete?: () => void
  ) => {
    // Clear any existing timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    startAnimation(type);

    const duration = ANIMATION_DURATIONS[type === 'rotating' ? 'rotation' : type];

    animationTimeoutRef.current = window.setTimeout(() => {
      endAnimation(type);
      animationTimeoutRef.current = null;
      onComplete?.();
    }, duration);
  }, [startAnimation, endAnimation]);

  // Sequence multiple animations using an iterative approach
  const runAnimationSequence = useCallback((
    animations: Array<{
      type: 'rotating' | 'falling' | 'clearing';
      beforeStart?: () => void;
      afterComplete?: () => void;
    }>,
    finalCallback?: () => void
  ) => {
    if (animations.length === 0) {
      finalCallback?.();
      return;
    }

    // Process animations iteratively by chaining callbacks
    let currentIndex = 0;

    const processNext = () => {
      if (currentIndex >= animations.length) {
        finalCallback?.();
        return;
      }

      const anim = animations[currentIndex];
      currentIndex++;

      anim.beforeStart?.();

      // Clear any existing timeout
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }

      startAnimation(anim.type);

      const duration = ANIMATION_DURATIONS[anim.type === 'rotating' ? 'rotation' : anim.type];

      animationTimeoutRef.current = window.setTimeout(() => {
        endAnimation(anim.type);
        animationTimeoutRef.current = null;
        anim.afterComplete?.();
        processNext();
      }, duration);
    };

    processNext();
  }, [startAnimation, endAnimation]);

  return {
    runAnimation,
    runAnimationSequence,
  };
}
