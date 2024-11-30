import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private language: string = 'en'; // Default language is English

  constructor() {
    // Check if a language is saved in local storage
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      this.language = savedLanguage;
    }
  }

  // Get the current language
  getLanguage(): string {
    return this.language;
  }

  // Set the language and save to local storage
  setLanguage(language: string): void {
    this.language = language;
    localStorage.setItem('language', language);
  }
}
