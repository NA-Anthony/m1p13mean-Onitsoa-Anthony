import { Injectable } from '@angular/core';
import { EcommerceService } from '../ecommerce/ecommerce.service';
import { Commande } from './commande.model';
import { Observable } from 'rxjs';

/**
 * Wrapper service for commande (order) operations.
 * Delegates to EcommerceService for API calls.
 * Acts as an adapter layer for components that depend on CommandeService.
 */
@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  constructor(private ecommerceService: EcommerceService) {}

  /**
   * Create a new commande (order).
   * @param commande The order data to create
   * @returns Observable<Commande> The created order with _id
   */
  createCommande(commande: Commande): Observable<Commande> {
    return this.ecommerceService.createCommande(commande);
  }

  /**
   * Get all commandes for the logged-in acheteur.
   * @returns Observable<Commande[]> Array of user's orders
   */
  getMesCommandes(): Observable<Commande[]> {
    return this.ecommerceService.getMesCommandes();
  }

  /**
   * Get a specific commande by ID.
   * @param id The commande ID
   * @returns Observable<Commande> The order details
   */
  getCommandeById(id: string): Observable<Commande> {
    return this.ecommerceService.getCommandeById(id);
  }
}
