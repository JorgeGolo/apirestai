import { Injectable } from '@angular/core';
import Groq from 'groq-sdk';
import { firstValueFrom, Observable } from 'rxjs';
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

  async sendMessage(prompt: string, model: string): Promise<string> {
    try {
      const completion = await this.groq.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });
  
      const content = completion.choices[0]?.message?.content;
  
      // Verificar si content es válido; en caso contrario, lanzar un error o retornar un mensaje predeterminado
      if (!content) {
        throw new Error('La respuesta de la API no contiene contenido válido.');
      }
  
      return content;
    } catch (error) {
      console.error('Error al enviar mensaje a la API de Groq:', error);
      throw error;
    }
  }

  async generateSummary(messages: string): Promise<string | null> {
    try {
      const prompt = `Resume de manera breve y precisa las siguientes interacciones recientes, sin redundancias:\n\n${messages}`;
      
      // Envía el mensaje usando el servicio de Groq
      const summary = await this.sendMessage(prompt, "Llama-3.1-8b-instant"); // Puedes cambiar el modelo según tus necesidades
      
      // Verifica si se obtuvo un resumen válido
      if (summary && summary.trim()) {
        return summary.trim();
      } else {
        console.warn('El resumen generado está vacío o no es válido.');
        return null;
      }
    } catch (error) {
      console.error('Error al generar el resumen con GroqService:', error);
      return null;
    }
  }
  
  
}