export type UserRole = "CUSTOMER" | "TRADE" | "ADMIN";

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  tradeCompany?: string;
  createdAt: string;
}
