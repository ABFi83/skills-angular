import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../config/environment';
import { EvaluationLM, EvaluationsLM, EvaluationRequest } from '../interfaces/evaluation.interface';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private readonly API_BASE_URL = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  /**
   * Recupera le valutazioni per un progetto in una data specifica
   * @param projectId ID del progetto
   * @param evaluationDate Data delle valutazioni
   * @returns Observable con le valutazioni
   */
  getEvaluationsByDate(projectId: string, evaluationDate: string): Observable<EvaluationsLM> {
    const params = new HttpParams().set('evaluationDate', evaluationDate);

    return this.http.get<EvaluationsLM>(
      `${this.API_BASE_URL}/projects/${projectId}/evaluations`,
      { params }
    );
  }

  /**
   * Recupera le valutazioni per un progetto (alias method)
   * @param projectId ID del progetto
   * @param evaluationDate Data delle valutazioni
   * @returns Observable con le valutazioni
   */
  getProjectEvaluations(projectId: string, evaluationDate: string): Observable<EvaluationsLM> {
    return this.getEvaluationsByDate(projectId, evaluationDate);
  }

  /**
   * Recupera le date delle valutazioni disponibili per un progetto
   * @param projectId ID del progetto
   * @returns Observable con array di date
   */
  getEvaluationDates(projectId: string): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.API_BASE_URL}/projects/${projectId}/evaluations-dates`
    );
  }

  /**
   * Crea una nuova valutazione per un progetto
   * @param projectId ID del progetto
   * @param evaluation Dati della valutazione da creare
   * @returns Observable con la valutazione creata
   */
  createEvaluation(projectId: string, evaluation: EvaluationRequest): Observable<any> {
    return this.http.post<any>(
      `${this.API_BASE_URL}/projects/${projectId}/evaluations`,
      evaluation
    );
  }

  /**
   * Aggiorna una valutazione esistente
   * @param projectId ID del progetto
   * @param evaluationId ID della valutazione
   * @param evaluation Dati aggiornati della valutazione
   * @returns Observable con la valutazione aggiornata
   */
  updateEvaluation(projectId: string, evaluationId: string, evaluation: Partial<EvaluationRequest>): Observable<any> {
    return this.http.put<any>(
      `${this.API_BASE_URL}/projects/${projectId}/evaluations/${evaluationId}`,
      evaluation
    );
  }

  /**
   * Elimina una valutazione
   * @param projectId ID del progetto
   * @param evaluationId ID della valutazione da eliminare
   * @returns Observable vuoto
   */
  deleteEvaluation(projectId: string, evaluationId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.API_BASE_URL}/projects/${projectId}/evaluations/${evaluationId}`
    );
  }

  /**
   * Salva i punteggi delle valutazioni
   * @param projectId ID del progetto
   * @param evaluationId ID della valutazione
   * @param scores Array di punteggi
   * @returns Observable con la risposta
   */
  saveEvaluationScores(projectId: string, evaluationId: string, scores: any[]): Observable<any> {
    return this.http.post<any>(
      `${this.API_BASE_URL}/projects/${projectId}/evaluations/${evaluationId}/scores`,
      { scores }
    );
  }

  /**
   * Chiude una valutazione (rende i punteggi definitivi)
   * @param projectId ID del progetto
   * @param evaluationId ID della valutazione
   * @returns Observable con la valutazione chiusa
   */
  closeEvaluation(projectId: string, evaluationId: string): Observable<any> {
    return this.http.patch<any>(
      `${this.API_BASE_URL}/projects/${projectId}/evaluations/${evaluationId}/close`,
      {}
    );
  }

  /**
   * Recupera le statistiche delle valutazioni per un progetto
   * @param projectId ID del progetto
   * @returns Observable con le statistiche
   */
  getEvaluationStats(projectId: string): Observable<any> {
    return this.http.get<any>(
      `${this.API_BASE_URL}/projects/${projectId}/evaluations/stats`
    );
  }
}
