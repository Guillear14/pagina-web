import { Injectable } from '@angular/core';
import { GoogleGenAI, Type, SchemaType } from '@google/genai';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env['API_KEY'] || '' });
  }

  async generateGamerProfile(name: string, genres: string[]): Promise<any> {
    const prompt = `
      Genera un perfil de jugador experto para un usuario llamado "${name}".
      Sus géneros favoritos son: ${genres.join(', ')}.
      
      1. Crea un "gamertag" único, creativo y relacionado con sus gustos.
      2. Escribe una biografía épica en primera persona (máximo 30 palabras).
      3. Recomienda 3 videojuegos específicos de alta calidad que encajen estrictamente con los géneros ${genres.join(', ')}.
         Para cada recomendación incluye: Título, el Género específico del juego, y una Razón convincente de por qué le gustará basándose en sus preferencias.
    `;

    // Let the component handle the try/catch to provide UI feedback
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            gamertag: { type: Type.STRING },
            bio: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  genre: { type: Type.STRING },
                  reason: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text);
  }

  async getGamingNews(): Promise<any[]> {
    const prompt = 'Dame 3 titulares breves y ficticios pero realistas sobre el futuro de los videojuegos en el año 2025. Formato JSON.';
    
    // Let the component handle the try/catch
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              summary: { type: Type.STRING }
            }
          }
        }
      }
    });
    return JSON.parse(response.text);
  }
}