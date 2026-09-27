/* MeridianCrest International — central site configuration.
   EDIT HERE to update contact details, market figures, upload limits and
   future i18n / currency settings. No other file needs to change. */
const COMPANY_CONFIG = {
  brand: "MeridianCrest International",
  positioning: "India-Origin Ingredients. Global Supply.",
  email: "ADD_EMAIL",
  whatsapp: "ADD_WHATSAPP",
  phone: "ADD_PHONE",
  address: "ADD_ADDRESS",
  hours: "ADD_BUSINESS_HOURS",
  contactConfigured: false // set true once real contact details are added above
};

/* Market-reach figures. IMPORTANT: keep verified:false until the company
   confirms each number. Unverified values render as neutral placeholders. */
const SITE_STATS = {
  continents: { value: 6, label: "Continents", verified: false },
  countries: { value: 50, suffix: "+", label: "Countries", verified: false },
  ports: { value: 40, suffix: "+", label: "Connected Ports", verified: false }
};

const QUOTE_CONFIG = {
  maxFileMB: 10,
  allowedTypes: ["pdf", "docx", "xlsx", "jpg", "jpeg", "png"],
  priceNote: "Price available on request"
};

/* Future currencies — display only, no live rates. */
const CURRENCIES = ["USD", "EUR", "GBP", "AED", "INR"];

/* Minimal i18n architecture: English default, additional locales added here later. */
const I18N = {
  defaultLocale: "en",
  locales: ["en"],
  strings: { en: {} }
};
