export interface orderItem {
  /**Définition de l'interface pour un item de commande, qui peut être utilisé pour représenter les détails d'un produit dans une commande passée.
   * 
   * - `id`: Identifiant unique de l'item de commande.
   * - `total_price`: Prix total de cet item (prix unitaire multiplié par la quantité).
   * - `status`: Statut actuel de l'item (ex: "pending", "shipped", "delivered").
   * - `created_at`: Date et heure de création de l'item.
   * - `updated_at`: Date et heure de la dernière mise à jour de l'item.
   * - `is_paid`: Indique si cet item a été payé ou non.
   */
  id: number;
  total_price: number;
  status: string;   
  created_at: string;
  updated_at: string;
  is_paid: boolean;
}


export interface OrderDetails {
  id: number;
  total_price: number;
  status: string;
  created_at: string;
  updated_at: string;
  is_paid?: boolean;
  items?: Array<{
    id: number;
    quantity: number;
    price: number;
    variant: number;
    size?: number | null;
  }>;
};