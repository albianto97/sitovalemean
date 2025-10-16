import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private currentTheme: 'light' | 'dark' = 'light';

  constructor() {
    const saved = localStorage.getItem('theme');
    this.currentTheme = saved === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.currentTheme);
  }

  toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);
  }

  isDark(): boolean {
    return this.currentTheme === 'dark';
  }
}
