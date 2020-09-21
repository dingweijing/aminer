import { setTimeout } from 'timers';

export function makeThrottle<T>(handler: (e: T) => any, timespan: number) {
  let lastEvent: T | null = null;
  let timeout: NodeJS.Timeout | null = null;
  const throttled = (e: T) => {
    if (!timeout) {
      handler(e);
      timeout = setTimeout(() => {
        timeout = null;
        if (lastEvent) {
          throttled(lastEvent);
          lastEvent = null;
        }
      }, timespan);
    } else {
      lastEvent = e;
    }
  };
  return throttled;
}
