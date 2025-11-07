export interface PremiumFeatureItem {
  icon: string; // emoji or icon text
  label: string;
}

export const PREMIUM_FEATURES: PremiumFeatureItem[] = [
  { icon: '📸', label: 'Photo invoice OCR' },
  { icon: '🎙️', label: 'Voice message invoices' },
  { icon: '🎨', label: 'Custom branding' },
  { icon: '📊', label: 'Higher monthly limits' },
  { icon: '💬', label: 'Priority support' },
];
