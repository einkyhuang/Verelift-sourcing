export interface ProcessStep {
  id: number;
  title: string;
  shortDescription: string;
  icon: string;
}

export interface GeneratedContent {
  stepId: number;
  content: string; // Markdown formatted content
  isLoading: boolean;
  error?: string;
}

export const STEPS: ProcessStep[] = [
  { id: 1, title: "Products Request", shortDescription: "Specs: Capacity, Fork Size, Lift Height", icon: "📋" },
  { id: 2, title: "Supplier Confirmation", shortDescription: "Factory Audit: Welding & Painting Quality", icon: "🏭" },
  { id: 3, title: "Quotations Confirmed", shortDescription: "Cost: Pump Type, Battery, Motor, Wheels", icon: "💲" },
  { id: 4, title: "Samples Arranging", shortDescription: "Quality Check: Seals, Hydraulics, Finish", icon: "🔍" },
  { id: 5, title: "Order Processing", shortDescription: "PI Details, Spare Parts List, Branding", icon: "⚙️" },
  { id: 6, title: "Delivery Arrange", shortDescription: "Loading Plan: Stacking & Space Optimization", icon: "🚢" },
  { id: 7, title: "After Sales Service", shortDescription: "Warranty: Pump Seals & Electrical Parts", icon: "🎧" },
];