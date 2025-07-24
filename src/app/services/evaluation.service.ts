import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EvaluationLM, EvaluationsLM, EvaluationRequest } from '../interfaces/evaluation.interface';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  constructor(private apiService: ApiService) {}

  /**
   * Recupera le valutazioni per un progetto in una data specifica
   * @param projectId ID del progetto
   * @param evaluationDate Data delle valutazioni
   * @returns Observable con le valutazioni
   */
  getEvaluationsByDate(projectId: string, evaluationDate: string): Observable<EvaluationsLM> {
    return this.apiService.get<EvaluationsLM>(
      `/projects/${projectId}/evaluation?evaluationDate=${evaluationDate}`
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
    return this.apiService.get<string[]>(
      `/projects/${projectId}/evaluations-dates`
    );
  }

  /**
   * Crea una nuova valutazione per un progetto
   * @param projectId ID del progetto
   * @param evaluation Dati della valutazione da creare
   * @returns Observable con la valutazione creata
   */
  createEvaluation(projectId: string, evaluation: EvaluationRequest): Observable<any> {
    return this.apiService.post<any>(
      `/projects/${projectId}/evaluation`,
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
    return this.apiService.put<any>(
      `/projects/${projectId}/evaluation/${evaluationId}`,
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
    return this.apiService.delete<void>(
      `/projects/${projectId}/evaluation/${evaluationId}`
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
    return this.apiService.post<any>(
      `/projects/${projectId}/evaluation/${evaluationId}/scores`,
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
    return this.apiService.patch<any>(
      `/projects/${projectId}/evaluation/${evaluationId}/close`,
      {}
    );
  }

  /**
   * Recupera le statistiche delle valutazioni per un progetto
   * @param projectId ID del progetto
   * @returns Observable con le statistiche
   */
  getEvaluationStats(projectId: string): Observable<any> {
    return this.apiService.get<any>(
      `/projects/${projectId}/evaluation/stats`
    );
  }
}
