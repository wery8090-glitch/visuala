"use client";

export function playUiTone(type: "click" | "success" | "error", enabled: boolean) {
  if (!enabled) return;
  try {
    const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const map = {
      click: { freq: 420, dur: 0.045 },
      success: { freq: 620, dur: 0.08 },
      error: { freq: 220, dur: 0.09 },
    }[type];

    osc.frequency.value = map.freq;
    osc.type = "sine";
    gain.gain.value = 0.02;

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + map.dur);
    osc.onended = () => void ctx.close();
  } catch {
    // ignore audio errors
  }
}
