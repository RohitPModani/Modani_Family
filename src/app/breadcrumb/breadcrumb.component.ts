import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FamilyTree } from '../../shared/models/family-tree.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'breadcrumb',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
  @Input() breadcrumbs: FamilyTree[] = [];
  @Input() isHindi: boolean = false; // Receives language preference from the parent
  @Output() breadcrumbClick = new EventEmitter<number>();

  // Get the breadcrumb name based on the language preference
  getBreadcrumbName(member: FamilyTree): string {
    return this.isHindi ? member.nameHindi || member.name : member.name;
  }

  // Handle breadcrumb click
  onBreadcrumbClick(index: number) {
    this.breadcrumbClick.emit(index);
  }
}
