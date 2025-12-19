import type { BankFormState } from "./bank-details-form.types";

export const DEFAULT_FORM: BankFormState = {
  businessName: "",
  bankName: "",
  accountNumber: "",
  accountName: "",
};

export const NIGERIAN_BANKS = [
  // Commercial Banks
  "Access Bank",
  "Citibank Nigeria",
  "Ecobank Nigeria",
  "Fidelity Bank",
  "First Bank of Nigeria",
  "First City Monument Bank (FCMB)",
  "Globus Bank",
  "Guaranty Trust Bank (GTBank)",
  "Heritage Bank",
  "Keystone Bank",
  "Polaris Bank",
  "Providus Bank",
  "Stanbic IBTC Bank",
  "Standard Chartered Bank",
  "Sterling Bank",
  "SunTrust Bank",
  "Titan Trust Bank",
  "Union Bank of Nigeria",
  "United Bank for Africa (UBA)",
  "Unity Bank",
  "Wema Bank",
  "Zenith Bank",
  
  // Digital/Fintech Banks
  "Kuda Bank",
  "Moniepoint",
  "Opay",
  "Palmpay",
  "Carbon (formerly Paylater)",
  "FairMoney",
  "Sparkle",
  "Rubies Bank",
  "VBank (VFD Microfinance Bank)",
  "Eyowo",
  "Mint Finex MFB",
  
  // Microfinance Banks
  "AB Microfinance Bank",
  "LAPO Microfinance Bank",
  "NPF Microfinance Bank",
  "Mutual Trust Microfinance Bank",
  "Hasal Microfinance Bank",
  "Peace Microfinance Bank",
  "Renmoney MFB",
  "Accion Microfinance Bank",
  "Fina Trust Microfinance Bank",
  "Grooming Microfinance Bank",
  
  // Payment Service Banks
  "9PSB (9 Payment Service Bank)",
  "Hope PSB",
  "MTN MoMo PSB",
  
  // Other Banks
  "Jaiz Bank",
  "Lotus Bank",
  "TAJBank",
  "Parallex Bank",
  "Coronation Merchant Bank",
  "FBNQuest Merchant Bank",
  "FSDH Merchant Bank",
  "Nova Merchant Bank",
  "Rand Merchant Bank",
];
