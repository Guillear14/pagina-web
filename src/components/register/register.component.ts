import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../services/gemini.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center p-4">
      <div class="glass-panel w-full max-w-2xl p-8 rounded-2xl shadow-2xl relative overflow-hidden animate-scale-in">
        <!-- Decoration -->
        <div class="absolute -top-20 -right-20 w-64 h-64 bg-purple-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
        <div class="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

        @if (isLoading()) {
          <div class="flex flex-col items-center justify-center py-20 space-y-6 animate-fade-in">
            <div class="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p class="text-xl font-bold animate-pulse text-center">
              La IA está analizando tu estilo de juego...<br>
              <span class="text-sm text-slate-400 font-normal">Creando Gamertag y Bio única</span>
            </p>
          </div>
        } @else {
          <div class="animate-fade-in">
            <h2 class="text-3xl md:text-4xl font-bold text-center mb-2 brand-font text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              Únete al Nexus
            </h2>
            <p class="text-center text-slate-400 mb-8">Crea tu identidad digital potenciada por IA</p>

            <form (ngSubmit)="onSubmit()" class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Tu Nombre (o Nick actual)</label>
                <input 
                  type="text" 
                  [(ngModel)]="name" 
                  name="name" 
                  required 
                  class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-300 focus:shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                  placeholder="Ej. Alex"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Tus Géneros Favoritos (Elige hasta 3)</label>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                  @for (genre of availableGenres; track genre) {
                    <button 
                      type="button"
                      (click)="toggleGenre(genre)"
                      [class.bg-purple-600]="selectedGenres().includes(genre)"
                      [class.border-purple-500]="selectedGenres().includes(genre)"
                      [class.bg-slate-800]="!selectedGenres().includes(genre)"
                      [class.border-slate-700]="!selectedGenres().includes(genre)"
                      class="px-3 py-2 rounded-lg border text-sm transition-all duration-200 active:scale-95 hover:bg-slate-700 text-left hover:shadow-lg hover:shadow-purple-500/10"
                    >
                      {{ genre }}
                    </button>
                  }
                </div>
                @if (showGenreError()) {
                  <p class="text-red-400 text-sm mt-2 animate-pulse">Por favor selecciona al menos un género.</p>
                }
              </div>

              <button 
                type="submit" 
                [disabled]="!name || selectedGenres().length === 0"
                class="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/20 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                GENERAR PERFIL & ENTRAR
              </button>
            </form>
          </div>
        }
      </div>
    </div>
  `
})
export class RegisterComponent {
  private geminiService = inject(GeminiService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  name = '';
  availableGenres = [
    'RPG', 'FPS', 'Estrategia', 'Terror', 'Deportes', 
    'Indie', 'MOBA', 'Aventura', 'Puzzle