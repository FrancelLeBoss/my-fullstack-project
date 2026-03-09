1; // src/types/User.ts
export interface User {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  // Ajoutez d'autres propriétés utilisateur selon vos besoins
}

export interface Address {
  id: number;
  user: number; // ID de l'utilisateur auquel cette adresse appartient
  street_address: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  addresses: Address[] | null; // Ajout de la liste d'adresses dans l'état d'authentification
  isLoading?: boolean; // Optionnel : pour indiquer si une opération d'authentification est en cours
  error?: string | null; // Optionnel : pour stocker les messages d'erreur liés à l'authentification
}
