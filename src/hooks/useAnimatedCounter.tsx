import { useEffect, useState } from 'react';

export const useAnimatedCounter = (maxValue: any, initialValue =  1, duration =  1000) => {
  const [counter, setCounter] = useState(initialValue);

  useEffect(() => {
    let animation: any;
    if (counter < maxValue) {
      // Use a simple interval to increment the counter
      animation = setInterval(() => {
        setCounter(prevCounter => {
          if (prevCounter < maxValue) {
            return prevCounter +  1;
          } else {
            clearInterval(animation);
            return prevCounter;
          }
        });
      }, duration / (maxValue - initialValue));
    }
    return () => {
      if (animation) {
        clearInterval(animation);
      }
    };
  }, [counter, maxValue, duration]);

  return counter;
};