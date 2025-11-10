interface ScreenOrientation {
  lock(orientation: 'portrait' | 'portrait-primary' | 'portrait-secondary' | 'landscape' | 'landscape-primary' | 'landscape-secondary'): Promise<void>;
  unlock(): void;
}
