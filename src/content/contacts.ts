export interface Contact {
  id: string;
  label: string;
  display: string;
  url: string;
}

// Add only verified contact methods. No placeholder accounts or addresses.
export const contacts: readonly Contact[] = [
  {
    id: "github",
    label: "GitHub",
    display: "github.com/Stasikent",
    url: "https://github.com/Stasikent",
  },
  { id: "telegram", label: "Telegram", display: "@stasikent", url: "https://t.me/stasikent" },
  { id: "email", label: "Email", display: "stasikent@gmail.com", url: "mailto:stasikent@gmail.com" },
];
