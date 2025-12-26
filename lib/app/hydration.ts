export type QueuedEntry = {
  local_id: string;
  user_id: string;
  amount_ml: number;
  logged_at: string;
  day: string;
  source?: string | null;
};

const QUEUE_KEY = "velah:hydration:queue";

export function dayKey(date = new Date()) {
  const tzOffset = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 10);
}

export function loadQueue(): QueuedEntry[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(QUEUE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveQueue(queue: QueuedEntry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function enqueueEntry(entry: QueuedEntry) {
  const queue = loadQueue();
  queue.push(entry);
  saveQueue(queue);
  return queue;
}

export function removeQueued(localId: string) {
  const queue = loadQueue().filter((item) => item.local_id !== localId);
  saveQueue(queue);
  return queue;
}
