import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Commande, COMMANDES_MOCK, STATUTS_COMMANDE } from './commande.model'; // ← Ajouter STATUTS_COMMANDE
import { ACHETEURS_MOCK } from '../acheteur/acheteur.model';
import { BOUTIQUES_MOCK } from '../boutique/boutique.model';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private commandes: Commande[] = [...COMMANDES_MOCK];

  getCommandes(): Observable<Commande[]> {
    const populated = this.commandes.map(cmd => ({
      ...cmd,
      acheteur: ACHETEURS_MOCK.find(a => a._id === cmd.idAcheteur),
      boutique: BOUTIQUES_MOCK.find(b => b._id === cmd.idBoutique)
    }));
    return of(populated);
  }

  getCommandeById(id: string): Observable<Commande | undefined> {
    const cmd = this.commandes.find(c => c._id === id);
    if (cmd) {
      const populated = {
        ...cmd,
        acheteur: ACHETEURS_MOCK.find(a => a._id === cmd.idAcheteur),
        boutique: BOUTIQUES_MOCK.find(b => b._id === cmd.idBoutique)
      };
      return of(populated);
    }
    return of(undefined);
  }

  getCommandesByAcheteur(idAcheteur: string): Observable<Commande[]> {
    const cmds = this.commandes.filter(c => c.idAcheteur === idAcheteur);
    const populated = cmds.map(cmd => ({
      ...cmd,
      acheteur: ACHETEURS_MOCK.find(a => a._id === cmd.idAcheteur),
      boutique: BOUTIQUES_MOCK.find(b => b._id === cmd.idBoutique)
    }));
    return of(populated);
  }

  getCommandesByBoutique(idBoutique: string): Observable<Commande[]> {
    const cmds = this.commandes.filter(c => c.idBoutique === idBoutique);
    const populated = cmds.map(cmd => ({
      ...cmd,
      acheteur: ACHETEURS_MOCK.find(a => a._id === cmd.idAcheteur),
      boutique: BOUTIQUES_MOCK.find(b => b._id === cmd.idBoutique)
    }));
    return of(populated);
  }

  createCommande(commande: Partial<Commande>): Observable<Commande> {
    const newCommande: Commande = {
      _id: `CMD${String(this.commandes.length + 1).padStart(3, '0')}`,
      idAcheteur: commande.idAcheteur || '',
      idBoutique: commande.idBoutique || '',
      dateCommande: new Date(),
      statut: 'en_attente',
      articles: commande.articles || [],
      adresseLivraison: commande.adresseLivraison || {
        rue: '', ville: '', codePostal: '', pays: 'France'
      },
      fraisLivraison: commande.fraisLivraison || 0,
      total: commande.total || 0,
      modePaiement: commande.modePaiement || '',
      paiementEffectue: commande.paiementEffectue || false
    };
    this.commandes.push(newCommande);
    
    const populated = {
      ...newCommande,
      acheteur: ACHETEURS_MOCK.find(a => a._id === newCommande.idAcheteur),
      boutique: BOUTIQUES_MOCK.find(b => b._id === newCommande.idBoutique)
    };
    return of(populated);
  }

  updateCommande(id: string, commande: Partial<Commande>): Observable<Commande | undefined> {
    const index = this.commandes.findIndex(c => c._id === id);
    if (index !== -1) {
      this.commandes[index] = { ...this.commandes[index], ...commande };
      
      const populated = {
        ...this.commandes[index],
        acheteur: ACHETEURS_MOCK.find(a => a._id === this.commandes[index].idAcheteur),
        boutique: BOUTIQUES_MOCK.find(b => b._id === this.commandes[index].idBoutique)
      };
      return of(populated);
    }
    return of(undefined);
  }

  updateStatut(id: string, statut: string): Observable<Commande | undefined> {
    const index = this.commandes.findIndex(c => c._id === id);
    if (index !== -1) {
      this.commandes[index].statut = statut as any;
      
      const populated = {
        ...this.commandes[index],
        acheteur: ACHETEURS_MOCK.find(a => a._id === this.commandes[index].idAcheteur),
        boutique: BOUTIQUES_MOCK.find(b => b._id === this.commandes[index].idBoutique)
      };
      return of(populated);
    }
    return of(undefined);
  }

  togglePaiement(id: string): Observable<Commande | undefined> {
    const index = this.commandes.findIndex(c => c._id === id);
    if (index !== -1) {
      this.commandes[index].paiementEffectue = !this.commandes[index].paiementEffectue;
      
      const populated = {
        ...this.commandes[index],
        acheteur: ACHETEURS_MOCK.find(a => a._id === this.commandes[index].idAcheteur),
        boutique: BOUTIQUES_MOCK.find(b => b._id === this.commandes[index].idBoutique)
      };
      return of(populated);
    }
    return of(undefined);
  }

  deleteCommande(id: string): Observable<void> {
    this.commandes = this.commandes.filter(c => c._id !== id);
    return of(void 0);
  }

  getStatutInfo(statut: string): { label: string, color: string } {
    const found = STATUTS_COMMANDE.find((s: any) => s.value === statut);
    return found || { label: statut, color: 'secondary' };
  }

  calculerTotal(articles: any[], fraisLivraison: number): number {
    const sousTotal = articles.reduce((acc, a) => {
      const prix = a.prixUnitaire - a.remise;
      return acc + (prix * a.quantite);
    }, 0);
    return sousTotal + fraisLivraison;
  }
}