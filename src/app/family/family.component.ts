import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FamilyTree } from '../../shared/models/family-tree.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-family',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.scss'],
})
export class FamilyComponent implements OnInit {
  familyTree: FamilyTree | null = null; // Entire family tree data
  currentMember: FamilyTree | null = null; // Currently selected member
  breadcrumbs: FamilyTree[] = []; // Breadcrumb trail
  isHindi = false; // Language preference

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadLanguagePreference();
    this.fetchFamilyTree();
  }

  /**
   * Load language preference from localStorage.
   */
  private loadLanguagePreference() {
    const savedLanguage = localStorage.getItem('language');
    this.isHindi = savedLanguage === 'Hindi';
  }

  /**
   * Fetch the family tree data from the JSON file.
   */
  private fetchFamilyTree() {
    this.http.get<FamilyTree>('assets/data/family-tree.json').subscribe({
      next: (data) => {
        this.familyTree = data;
        this.currentMember = data;
        this.breadcrumbs = [data]; // Initialize breadcrumbs with the root
      },
      error: (err) => {
        console.error('Error loading family tree data:', err);
      },
    });
  }

  /**
   * Get the name of a breadcrumb member, applying formatting rules.
   * @param member - FamilyTree member
   */
  getBreadcrumbMemberName(member: FamilyTree): string {
    const fullName = this.isHindi ? member.nameHindi || member.name : member.name;

    if (fullName.includes('(Adopted)') || fullName.includes('(दत्तक)')) {
      return this.isHindi
        ? fullName.split('(दत्तक)')[0].trim()
        : fullName.split('(Adopted)')[0].trim();
    }
    if (fullName.includes('-')) {
      return fullName.split('-')[0].trim();
    }
    if (fullName.includes('(')) {
      return fullName.split('(')[0].trim();
    }
    return fullName;
  }

  /**
   * Get the name of a member for display, based on the selected language.
   * @param member - FamilyTree member
   */
  getMemberName(member: FamilyTree): string {
    return this.isHindi ? member.nameHindi || member.name : member.name;
  }

  /**
   * Navigate to the selected child member.
   * Scrolls the breadcrumb into view if overflowed.
   * @param child - Selected child member
   */
  selectChild(child: FamilyTree) {
    this.currentMember = child;
    this.updateBreadcrumbs(child);

    // Scroll the last breadcrumb into view
    setTimeout(() => {
      const lastBreadcrumbIndex = this.breadcrumbs.length - 1;
      const breadcrumbElement = document.getElementById(`breadcrumb-${lastBreadcrumbIndex}`);
      breadcrumbElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }, 0);
  }

  /**
   * Navigate to a specific breadcrumb member.
   * Scrolls to the selected breadcrumb if overflowed.
   * @param index - Index of the breadcrumb
   */
  navigateToBreadcrumb(index: number) {
    this.currentMember = this.breadcrumbs[index];
    this.breadcrumbs = this.breadcrumbs.slice(0, index + 1); // Truncate breadcrumbs

    // Scroll the selected breadcrumb into view
    setTimeout(() => {
      const breadcrumbElement = document.getElementById(`breadcrumb-${index}`);
      breadcrumbElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }, 0);
  }

  /**
   * Navigate back to the root member.
   */
  navigateToRoot() {
    if (this.familyTree) {
      this.currentMember = this.familyTree;
      this.breadcrumbs = [this.familyTree]; // Reset breadcrumbs to the root
    }
  }

  /**
   * Navigate to the parent member of the current member.
   */
  navigateToParent() {
    if (this.breadcrumbs.length > 1) {
      this.breadcrumbs.pop(); // Remove the last breadcrumb
      this.currentMember = this.breadcrumbs[this.breadcrumbs.length - 1];
    } else {
      console.warn('No parent available to navigate to.');
    }
  }

  /**
   * Navigate to the landing page.
   */
  navigateToLanding() {
    this.router.navigate(['/']);
  }

  /**
   * Update the breadcrumb trail to maintain proper hierarchy.
   * @param member - Current family tree member
   */
  private updateBreadcrumbs(member: FamilyTree) {
    const index = this.breadcrumbs.findIndex((b) => b.id === member.id);

    if (index === -1) {
      // If the member is not in breadcrumbs, add it to the trail
      this.breadcrumbs.push(member);
    } else {
      // If the member exists, truncate breadcrumbs up to this member
      this.breadcrumbs = this.breadcrumbs.slice(0, index + 1);
    }
  }
}
