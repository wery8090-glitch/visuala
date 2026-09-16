"use client";

export type UpdateState = {
  status: "idle" | "checking" | "downloading" | "installing" | "up_to_date";
  progress: number;
  currentVersion: string;
  latestVersion: string;
};

export class UpdateService {
  static async simulate(onChange: (state: Partial<UpdateState>) => void) {
    onChange({ status: "checking", progress: 0 });
    await new Promise((r) => setTimeout(r, 700));

    onChange({ status: "downloading", progress: 20 });
    for (let p = 20; p <= 85; p += 13) {
      onChange({ status: "downloading", progress: p });
      await new Promise((r) => setTimeout(r, 300));
    }

    onChange({ status: "installing", progress: 92 });
    await new Promise((r) => setTimeout(r, 700));
    onChange({ status: "up_to_date", progress: 100, currentVersion: "1.0.1", latestVersion: "1.0.1" });
  }
}
