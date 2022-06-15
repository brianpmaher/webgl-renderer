export interface Timer {
  prevTime: number;
  time: number;
}

export function createTimer(): Timer {
  return {
    prevTime: 0,
    time: 0,
  };
}

export function tick(timer: Timer, now: number): number {
  timer.time = now * 0.001;
  const delta = timer.time - timer.prevTime;
  timer.prevTime = timer.time;
  return delta;
}
