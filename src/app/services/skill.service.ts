import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Skill {
  id: string;
  name: string;
  shortLabel?: string;
  description?: string;
  category?: string;
  level?: number;
  isActive?: boolean;
}

export interface SkillCategory {
  id: string;
  name: string;
  description?: string;
  skills?: Skill[];
}

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  constructor(private apiService: ApiService) {}

  /**
   * Recupera le skill con filtro di ricerca
   * @param searchQuery Query di ricerca (opzionale)
   * @returns Observable con array di skill
   */
  getSkills(searchQuery: string = ''): Observable<Skill[]> {
    const endpoint = searchQuery ? `/skills?search=${searchQuery}` : '/skills';
    return this.apiService.get<Skill[]>(endpoint);
  }

  /**
   * Recupera una skill specifica per ID
   * @param skillId ID della skill
   * @returns Observable con i dati della skill
   */
  getSkillById(skillId: string): Observable<Skill> {
    return this.apiService.get<Skill>(`/skills/${skillId}`);
  }

  /**
   * Crea una nuova skill
   * @param skill Dati della skill da creare
   * @returns Observable con la skill creata
   */
  createSkill(skill: Omit<Skill, 'id'>): Observable<Skill> {
    return this.apiService.post<Skill>('/skills', skill);
  }

  /**
   * Aggiorna una skill esistente
   * @param skillId ID della skill da aggiornare
   * @param skill Dati aggiornati della skill
   * @returns Observable con la skill aggiornata
   */
  updateSkill(skillId: string, skill: Partial<Skill>): Observable<Skill> {
    return this.apiService.put<Skill>(`/skills/${skillId}`, skill);
  }

  /**
   * Elimina una skill
   * @param skillId ID della skill da eliminare
   * @returns Observable vuoto
   */
  deleteSkill(skillId: string): Observable<void> {
    return this.apiService.delete<void>(`/skills/${skillId}`);
  }

  /**
   * Recupera le categorie di skill
   * @returns Observable con array di categorie
   */
  getSkillCategories(): Observable<SkillCategory[]> {
    return this.apiService.get<SkillCategory[]>('/skills/categories');
  }

  /**
   * Recupera le skill per categoria
   * @param categoryId ID della categoria
   * @returns Observable con array di skill
   */
  getSkillsByCategory(categoryId: string): Observable<Skill[]> {
    return this.apiService.get<Skill[]>(`/skills/categories/${categoryId}/skills`);
  }

  /**
   * Ricerca skill avanzata con filtri multipli
   * @param filters Oggetto con i filtri di ricerca
   * @returns Observable con array di skill filtrate
   */
  searchSkills(filters: {
    query?: string;
    category?: string;
    level?: number;
    isActive?: boolean;
  }): Observable<Skill[]> {
    const params = new URLSearchParams();

    if (filters.query) {
      params.set('search', filters.query);
    }
    if (filters.category) {
      params.set('category', filters.category);
    }
    if (filters.level !== undefined) {
      params.set('level', filters.level.toString());
    }
    if (filters.isActive !== undefined) {
      params.set('isActive', filters.isActive.toString());
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/skills/search?${queryString}` : '/skills/search';
    return this.apiService.get<Skill[]>(endpoint);
  }

  /**
   * Recupera le skill più utilizzate
   * @param limit Numero massimo di skill da restituire
   * @returns Observable con array di skill popolari
   */
  getPopularSkills(limit: number = 10): Observable<Skill[]> {
    return this.apiService.get<Skill[]>(`/skills/popular?limit=${limit}`);
  }

  /**
   * Recupera le skill consigliate per un utente
   * @param userId ID dell'utente
   * @returns Observable con array di skill consigliate
   */
  getRecommendedSkills(userId: string): Observable<Skill[]> {
    return this.apiService.get<Skill[]>(`/users/${userId}/recommended-skills`);
  }

  /**
   * Valida se una skill esiste
   * @param skillName Nome della skill
   * @returns Observable con boolean che indica se esiste
   */
  validateSkillExists(skillName: string): Observable<boolean> {
    return this.apiService.get<boolean>(`/skills/validate?name=${skillName}`);
  }
}
