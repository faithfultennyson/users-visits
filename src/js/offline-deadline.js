// 5s deadline that starts on first paint, resets on offline, resumes on online.
export function adaptiveDeadline(ms, onExpire) {
  let remain = ms, timer = 0, startedAt = 0, online = navigator.onLine;

  const clear = () => { if (timer) { clearTimeout(timer); timer = 0; } };
  const start = () => {
    if (timer || remain <= 0) return;
    startedAt = performance.now();
    timer = setTimeout(() => { timer = 0; onExpire(); }, remain);
  };
  const reset = () => { clear(); remain = ms; };
  const pauseAndAccumulate = () => {
    if (!timer) return;
    const spent = performance.now() - startedAt;
    clear(); remain = Math.max(0, remain - spent);
  };

  window.addEventListener('offline', () => { online = false; reset(); });
  window.addEventListener('online',  () => { if (!online) { online = true; start(); } });

  return { start, reset, pauseAndAccumulate, remaining: () => remain };
}
