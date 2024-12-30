import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FamilyTree } from '../../shared/models/family-tree.model';

interface SearchResult {
  id: string;
  name: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  isHindi: boolean = false;
  isSearchMode: boolean = false;
  searchQuery: string = '';
  searchResults: SearchResult[] = [];
  familyTree: FamilyTree | null = null; // Entire family tree data
  familyDictionary: Map<string, string> = new Map(); // Preloaded dictionary (id -> name)

  // Variables to store current selected person, their parent, and their children
  selectedPerson: any = null;
  parentPerson: any = null;
  childPersons: any[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.loadLanguagePreference();
    this.loadFamilyTree();
  }

  toggleLanguage(event: any) {
    this.isHindi = event.target.checked;
    localStorage.setItem('language', this.isHindi ? 'Hindi' : 'English');

    // Reload the dictionary with the selected language
    if (this.familyTree) {
      this.familyDictionary.clear(); // Clear previous dictionary
      this.populateDictionary(this.familyTree);
    }
  }


  navigateToFamilyTree() {
    this.router.navigate(['/family']);
  }

  loadFamilyTree(): void {
    this.http.get<FamilyTree>('assets/data/family-tree.json').subscribe({
      next: (data) => {
        this.familyTree = data;
        this.populateDictionary(data); // Preload data into the dictionary
      },
      error: (err) => {
        console.error('Error loading family tree data:', err);
      },
    });
  }

  private loadLanguagePreference(): void {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      this.isHindi = savedLanguage === 'Hindi';
    }
  }

  performSearch(): void {
    this.searchResults = [];
    const query = this.searchQuery.trim().toLowerCase();

    if (query.length > 3) {
      this.clearTreeDisplay();

      // Use Hindi or English names based on the language flag
      this.searchResults = Array.from(this.familyDictionary.entries())
        .filter(([id, name]) => name.toLowerCase().includes(query))
        .map(([id, name]) => ({ id, name }));
    }
  }

  clearLandingContent() {
    this.isSearchMode = true;
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.isSearchMode = false;
    this.searchResults = [];
    this.clearTreeDisplay();
  }

  private populateDictionary(node: any): void {
    if (node && node.id) {
      const name = this.isHindi ? node.nameHindi : node.name;
      if (name) {
        this.familyDictionary.set(node.id, name);
      }
    }

    if (node.children && node.children.childList) {
      for (const child of node.children.childList) {
        this.populateDictionary(child);
      }
    }
  }

  onResultClick(result: SearchResult): void {
    this.isSearchMode = true; // Exit search mode to clear the page
    this.searchResults = []; // Clear search results
    this.searchQuery = ''; // Reset search query
    this.clearTreeDisplay(); // Clear the current tree display

    if (this.familyTree) {
      this.findPersonById(this.familyTree, result.id); // Load the clicked person's details
    }
  }

  private findPersonById(node: any, id: string, parent: any = null): void {
    if (node.id === id) {
      // Set the selected person and their parent
      this.selectedPerson = {
        ...node,
        displayName: this.isHindi ? node.nameHindi || node.name : node.name, // Fallback to English if Hindi name is unavailable
      };
      this.parentPerson = parent
        ? {
            ...parent,
            displayName: this.isHindi ? parent.nameHindi || parent.name : parent.name,
          }
        : null;

      // Set child nodes with display names based on the language
      this.childPersons = (node.children?.childList || []).map((child: any) => ({
        ...child,
        displayName: this.isHindi ? child.nameHindi || child.name : child.name,
      }));
    } else if (node.children && node.children.childList) {
      // Recursively search in children
      for (const child of node.children.childList) {
        this.findPersonById(child, id, node);
      }
    }
  }

  private clearTreeDisplay(): void {
    this.selectedPerson = null;
    this.parentPerson = null;
    this.childPersons = [];
  }
}
