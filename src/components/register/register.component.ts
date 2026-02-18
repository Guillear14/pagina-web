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
              Entra al Vortex
            </h2>
            <p class="text-center text-slate-400 mb-8">Crea tu identidad digital potenciada por IA</p>

            <form (ngSubmit)="onSubmit()" class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Tu Nombre (o Nick actual)</label>
                <div class="relative">
                  <input 
                    type="text" 
                    [(ngModel)]="name" 
                    name="name" 
                    required 
                    [class.border-red-500]="nameError"
                    [class.focus:ring-red-500]="nameError"
                    [class.focus:shadow-red-500_30]="nameError"
                    class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-300 focus:shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                    placeholder="Ej. Alex"
                  />
                  @if (nameError) {
                    <div class="absolute right-3 top-3 text-red-400 animate-pulse">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  }
                </div>
                @if (nameError) {
                  <p class="text-red-400 text-xs mt-1 ml-1">{{ nameError }}</p>
                }
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
                [disabled]="!isFormValid"
                class="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/20 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
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
    'Indie', 'MOBA', 'Aventura', 'Puzzle', 'Simulación', 
    'Lucha', 'Carreras', 'Battle Royale', 'Plataformas', 'MMORPG'
  ];
  selectedGenres = signal<string[]>([]);
  isLoading = signal(false);
  showGenreError = signal(false);

  // Getter to validate name in real-time
  get nameError(): string | null {
    if (!this.name) return null; // Don't show error if empty (button simply disabled)
    
    const trimmedName = this.name.trim();
    if (trimmedName.length < 3) {
      return 'El nombre debe tener al menos 3 caracteres.';
    }
    
    // Check for special characters (allow letters, numbers, and spaces)
    const validPattern = /^[a-zA-Z0-9 ]+$/;
    if (!validPattern.test(this.name)) {
      return 'No se permiten caracteres especiales.';
    }

    return null;
  }

  // Helper for button disabled state
  get isFormValid(): boolean {
    return !!this.name && !this.nameError && this.selectedGenres().length > 0;
  }

  toggleGenre(genre: string) {
    this.selectedGenres.update(genres => {
      if (genres.includes(genre)) {
        return genres.filter(g => g !== genre);
      }
      if (genres.length >= 3) return genres;
      return [...genres, genre];
    });
    this.showGenreError.set(false);
  }

  async onSubmit() {
    if (!this.isFormValid) {
      if (this.selectedGenres().length === 0) this.showGenreError.set(true);
      return;
    }

    this.isLoading.set(true);
    
    try {
      // AI Magic
      const profileData = await this.geminiService.generateGamerProfile(this.name, this.selectedGenres());
      
      this.toastService.show(`¡Bienvenido al Vortex, ${profileData.gamertag}!`, 'success');
      
      this.authService.login({
        name: this.name,
        genres: this.selectedGenres(),
        gamertag: profileData.gamertag,
        bio: profileData.bio,
        recommendations: profileData.recommendations
      });

    } catch (e) {
      console.error(e);
      // Notify user about the error
      this.toastService.show('Problema con la IA. Usando perfil básico de emergencia.', 'error');
      
      // Fallback manual login if AI fails (Graceful degradation)
      this.authService.login({
        name: this.name,
        genres: this.selectedGenres(),
        gamertag: `${this.name}_Player`,
        bio: 'Un jugador misterioso que ha entrado al Vortex sin conexión a la IA.',
        recommendations: []
      });
    } finally {
      this.isLoading.set(false);
    }
  }
}