"use client";

export type DownloadState = {
  status: "ready" | "downloading" | "downloaded";
  progress: number;
};

export class DownloadService {
  static simulate(onChange: (state: DownloadState) => void) {
    onChange({ status: "downloading", progress: 5 });
    let progress = 5;
    const timer = setInterval(() => {
      progress = Math.min(100, progress + Math.floor(Math.random() * 14) + 6);
      if (progress >= 100) {
        clearInterval(timer);
        onChange({ status: "downloaded", progress: 100 });
        return;
      }
      onChange({ status: "downloading", progress });
    }, 420);
    return () => clearInterval(timer);
  }
}
