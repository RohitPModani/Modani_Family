import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  // Default language is English
  isHindi: boolean = false;

  constructor(
    private router: Router
  ) {}

  // Toggle language between Hindi and English
  toggleLanguage(event: any) {
    this.isHindi = event.target.checked;
    localStorage.setItem('language', this.isHindi ? 'Hindi' : 'English');
  }

  // Navigate to the family tree page
  navigateToFamilyTree() {
    this.router.navigate(['/family']);
  }

  // Initialize component
  ngOnInit() {
    this.loadLanguagePreference();
  }

  // Load the saved language preference from localStorage
  private loadLanguagePreference(): void {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      this.isHindi = savedLanguage === 'Hindi';
    }
  }
}
