import { Injectable } from '@angular/core';
import Groq from 'groq-sdk';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GroqService {
  private groq: Groq;

  constructor() {
    const apiKey = environment.groqapiKey; // Puedes reemplazarlo con `environment.groqApiKey`
    this.groq = new Groq({ apiKey, dangerouslyAllowBrowser: true }); // Opción habilitada
  }

  // Obtener lista de modelos
  async getModels(): Promise<{ id: number, name: string }[]> {
    try {
      const response: any = await this.groq.models.list();
      //console.log('Respuesta completa de Groq:', response);
  
      // Construir un array con la estructura deseada
      const models = response.data.map((model: any, index: number) => ({
        id: index,
        name: model.id, // Usar el `id` del modelo como `name`
      }));
  
      //console.log('Estructura transformada de modelos:', models);
      return models;
    } catch (error) {
      console.error('Error al obtener los modelos de Groq:', error);
      throw error;
    }
  }

  
}