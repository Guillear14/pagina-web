import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { GeminiService } from '../../services/gemini.service';
import { ToastService } from '../../services/toast.service';
import { GameCardComponent } from '../game-card/game-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, GameCardComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Welcome Hero Section -->
      @if (authService.currentUser(); as user) {
        <div class="mb-12 relative overflow-hidden rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl animate-slide-up">
          <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-900/40 to-transparent"></div>
          <div class="p-8 md:p-12 relative z-10">
            <div class="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div class="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 p-[2px] shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                <div class="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                  <span class="text-3xl">🎮</span>
                </div>
              </div>
              <div>
                <h1 class="text-3xl md:text-5xl font-bold text-white mb-2 brand-font">
                  Hola, <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">{{ user.gamertag }}</span>
                </h1>
                <p class="text-slate-300 text-lg max-w-2xl italic">"{{ user.bio }}"</p>
              </div>
            </div>
          </div>
        </div>

        <!-- AI Recommendations Section -->
        @if (user.recommendations && user.recommendations.length > 0) {
          <div class="mb-12 animate-slide-up delay-100">
            <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span class="text-purple-400">✨</span> Recomendados por la IA para ti
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              @for (rec of user.recommendations; track $index) {
                <div class="glass-panel p-6 rounded-xl border-l-4 border-purple-500 hover:bg-slate-800/80 transition-all duration-300 hover:translate-y-[-5px]">
                  <div class="flex justify-between items-start mb-2">
                    <h3 class="text-xl font-bold text-white">{{ rec.title }}</h3>
                    @if (rec.genre) {
                      <span class="text-xs font-bold text-purple-300 bg-purple-900/50 px-2 py-1 rounded border border-purple-500/30">
                        {{ rec.genre }}
                      </span>
                    }
                  </div>
                  <p class="text-slate-400 text-sm leading-relaxed">{{ rec.reason }}</p>
                </div>
              }
            </div>
          </div>
        }
      }

      <!-- Latest News (AI Generated) -->
      <div class="mb-16 animate-slide-up delay-200">
        <h2 class="text-2xl font-bold text-white mb-6">Noticias del Futuro</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          @if (loadingNews()) {
            @for (i of [1,2,3]; track i) {
               <div class="h-32 bg-slate-800 rounded-xl animate-pulse"></div>
            }
          } @else {
            @for (news of newsList(); track $index) {
              <div class="bg-slate-800/50 p-6 rounded-xl hover:bg-slate-800 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-cyan-500/10 hover:scale-[1.02]">
                <span class="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 block">Tendencia</span>
                <h3 class="text-lg font-bold text-white mb-2">{{ news.headline }}</h3>
                <p class="text-slate-400 text-sm">{{ news.summary }}</p>
              </div>
            }
          }
        </div>
      </div>

      <!-- Featured Games Grid -->
      <div class="animate-slide-up delay-300">
        <h2 class="text-2xl font-bold text-white mb-6">Juegos Destacados</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <app-game-card 
            title="Cyber Odyssey 2077" 
            description="Explora una metrópolis de neón donde cada decisión cambia tu código genético."
            imageUrl="https://picsum.photos/400/300?random=1"
            rating="9.8"
          ></app-game-card>
          <app-game-card 
            title="Star Field Legends" 
            description="Combates espaciales masivos en el borde de la galaxia conocida."
            imageUrl="https://picsum.photos/400/300?random=2"
            rating="8.9"
          ></app-game-card>
          <app-game-card 
            title="Ancient Souls" 
            description="Un RPG de acción brutal ambientado en ruinas mitológicas."
            imageUrl="https://picsum.photos/400/300?random=3"
            rating="9.5"
          ></app-game-card>
          <app-game-card 
            title="Speed Demon X" 
            description="Carreras antigravedad a velocidades hipersónicas."
            imageUrl="https://picsum.photos/400/300?random=4"
            rating="9.1"
          ></app-game-card>
        </div>
      </div>

    </div>
  `
})
export class HomeComponent implements OnInit {
  authService = inject(AuthService);
  private geminiService = inject(GeminiService);
  private toastService = inject(ToastService);
  
  newsList = signal<any[]>([]);
  loadingNews = signal(true);

  async ngOnInit() {
    this.loadingNews.set(true);
    try {
      const news = await this.geminiService.getGamingNews();
      this.newsList.set(news);
    } catch (e) {
      console.error(e);
      this.toastService.show('No se pudieron cargar las noticias de la red neuronal.', 'error');
      // Fallback empty or default news to prevent empty space looking broken
      this.newsList.set([
        { headline: "Error de Conexión", summary: "Imposible conectar con los servidores de noticias del futuro." }
      ]);
    } finally {
      this.loadingNews.set(false);
    }
  }
}