import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FamilyTree } from '../../shared/models/family-tree.model';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-family',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.scss'],
})
export class FamilyComponent implements OnInit {
  familyTree: FamilyTree | null = null; // Holds the entire tree data
  currentMember: FamilyTree | null = null; // Tracks the currently selected family member
  breadcrumbs: FamilyTree[] = []; // Tracks the breadcrumb trail
  isHindi: boolean = false; // Tracks language preference

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    // Check language preference stored in localStorage
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      this.isHindi = savedLanguage === 'Hindi';
    }

    // Fetch the family tree JSON data
    this.http.get<FamilyTree>('assets/data/family-tree.json').subscribe(
      (data) => {
        this.familyTree = data;
        this.currentMember = this.familyTree;
        this.breadcrumbs.push(this.familyTree);
      },
      (error) => {
        console.error('Error loading family tree data:', error);
      }
    );
  }

  // Get the member's name based on the selected language (English or Hindi)
  getMemberName(member: FamilyTree): string {
    return this.isHindi ? member.nameHindi || member.name : member.name;
  }

  // Navigate to the selected child
  selectChild(child: FamilyTree) {
    this.currentMember = child;
    this.breadcrumbs.push(child);
  }

  // Navigate back to a specific breadcrumb
  navigateToBreadcrumb(index: number) {
    this.currentMember = this.breadcrumbs[index];
    this.breadcrumbs = this.breadcrumbs.slice(0, index + 1);
  }

  // Navigate back to the root member
  navigateToRoot() {
    if (this.familyTree) {
      this.currentMember = this.familyTree;
      this.breadcrumbs = [this.familyTree];
    }
  }

  // Navigate to the landing page
  navigateToLanding() {
    this.router.navigate(['/']); // Update the route path as per your landing page setup
  }
}
