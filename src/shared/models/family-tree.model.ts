export interface FamilyTree {
  id: string;
  name: string;        // English name of the family member
  nameHindi?: string;  // Hindi name of the family member (optional)
  children: {
    childId: string;
    childList: FamilyTree[];
  };
}
