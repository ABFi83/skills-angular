import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../config/environment';

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
  private readonly API_BASE_URL = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  /**
   * Recupera le skill con filtro di ricerca
   * @param searchQuery Query di ricerca (opzionale)
   * @returns Observable con array di skill
   */
  getSkills(searchQuery: string = ''): Observable<Skill[]> {
    let params = new HttpParams();

    if (searchQuery) {
      params = params.set('search', searchQuery);
    }

    return this.http.get<Skill[]>(`${this.API_BASE_URL}/skills`, { params });
  }

  /**
   * Recupera una skill specifica per ID
   * @param skillId ID della skill
   * @returns Observable con i dati della skill
   */
  getSkillById(skillId: string): Observable<Skill> {
    return this.http.get<Skill>(`${this.API_BASE_URL}/skills/${skillId}`);
  }

  /**
   * Crea una nuova skill
   * @param skill Dati della skill da creare
   * @returns Observable con la skill creata
   */
  createSkill(skill: Omit<Skill, 'id'>): Observable<Skill> {
    return this.http.post<Skill>(`${this.API_BASE_URL}/skills`, skill);
  }

  /**
   * Aggiorna una skill esistente
   * @param skillId ID della skill da aggiornare
   * @param skill Dati aggiornati della skill
   * @returns Observable con la skill aggiornata
   */
  updateSkill(skillId: string, skill: Partial<Skill>): Observable<Skill> {
    return this.http.put<Skill>(`${this.API_BASE_URL}/skills/${skillId}`, skill);
  }

  /**
   * Elimina una skill
   * @param skillId ID della skill da eliminare
   * @returns Observable vuoto
   */
  deleteSkill(skillId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE_URL}/skills/${skillId}`);
  }

  /**
   * Recupera le categorie di skill
   * @returns Observable con array di categorie
   */
  getSkillCategories(): Observable<SkillCategory[]> {
    return this.http.get<SkillCategory[]>(`${this.API_BASE_URL}/skills/categories`);
  }

  /**
   * Recupera le skill per categoria
   * @param categoryId ID della categoria
   * @returns Observable con array di skill
   */
  getSkillsByCategory(categoryId: string): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.API_BASE_URL}/skills/categories/${categoryId}/skills`);
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
    let params = new HttpParams();

    if (filters.query) {
      params = params.set('search', filters.query);
    }
    if (filters.category) {
      params = params.set('category', filters.category);
    }
    if (filters.level !== undefined) {
      params = params.set('level', filters.level.toString());
    }
    if (filters.isActive !== undefined) {
      params = params.set('isActive', filters.isActive.toString());
    }

    return this.http.get<Skill[]>(`${this.API_BASE_URL}/skills/search`, { params });
  }

  /**
   * Recupera le skill più utilizzate
   * @param limit Numero massimo di skill da restituire
   * @returns Observable con array di skill popolari
   */
  getPopularSkills(limit: number = 10): Observable<Skill[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<Skill[]>(`${this.API_BASE_URL}/skills/popular`, { params });
  }

  /**
   * Recupera le skill consigliate per un utente
   * @param userId ID dell'utente
   * @returns Observable con array di skill consigliate
   */
  getRecommendedSkills(userId: string): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.API_BASE_URL}/users/${userId}/recommended-skills`);
  }

  /**
   * Valida se una skill esiste
   * @param skillName Nome della skill
   * @returns Observable con boolean che indica se esiste
   */
  validateSkillExists(skillName: string): Observable<boolean> {
    const params = new HttpParams().set('name', skillName);
    return this.http.get<boolean>(`${this.API_BASE_URL}/skills/validate`, { params });
  }
}
