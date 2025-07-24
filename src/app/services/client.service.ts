import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../config/environment';
import { ApiService } from './api.service';

export interface Client {
  id: string;
  name: string;
  code: string;
  logoUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly API_BASE_URL = environment.apiBaseUrl;

  constructor(private apiService: ApiService) {}

  /**
   * Genera l'URL del logo del cliente
   * @param clientCode Codice del cliente
   * @returns URL del logo del cliente
   */
  getClientLogoUrl(clientCode: string): string {
    if (!clientCode) {
      return this.getDefaultLogoUrl();
    }
    return `${this.API_BASE_URL}/logo/${clientCode}`;
  }

  /**
   * Recupera la lista dei clienti con filtro di ricerca
   * @param searchQuery Query di ricerca
   * @returns Observable con la lista dei clienti
   */
  getClients(searchQuery: string = ''): Observable<Client[]> {
    const endpoint = searchQuery ? `/clients?search=${searchQuery}` : '/clients';
    return this.apiService.get<Client[]>(endpoint);
  }

  /**
   * Recupera un cliente specifico per ID
   * @param clientId ID del cliente
   * @returns Observable con i dati del cliente
   */
  getClientById(clientId: string): Observable<Client> {
    return this.apiService.get<Client>(`/clients/${clientId}`);
  }

  /**
   * Crea un nuovo cliente
   * @param client Dati del cliente da creare
   * @returns Observable con il cliente creato
   */
  createClient(client: Omit<Client, 'id'>): Observable<Client> {
    return this.apiService.post<Client>('/clients', client);
  }

  /**
   * Aggiorna un cliente esistente
   * @param clientId ID del cliente da aggiornare
   * @param client Dati aggiornati del cliente
   * @returns Observable con il cliente aggiornato
   */
  updateClient(clientId: string, client: Partial<Client>): Observable<Client> {
    return this.apiService.put<Client>(`/clients/${clientId}`, client);
  }

  /**
   * Elimina un cliente
   * @param clientId ID del cliente da eliminare
   * @returns Observable vuoto
   */
  deleteClient(clientId: string): Observable<void> {
    return this.apiService.delete<void>(`/clients/${clientId}`);
  }

  /**
   * Restituisce l'URL del logo di default
   * @returns URL del logo di default
   */
  private getDefaultLogoUrl(): string {
    return 'assets/images/default-client-logo.svg';
  }

  /**
   * Verifica se un URL di logo è valido
   * @param logoUrl URL da verificare
   * @returns Promise che risolve true se l'URL è valido
   */
  async isLogoUrlValid(logoUrl: string): Promise<boolean> {
    try {
      const response = await fetch(logoUrl, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }
}
