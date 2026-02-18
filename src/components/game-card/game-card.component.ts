import { Component, input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  template: `
    <div class="glass-panel rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 h-full flex flex-col group relative animate-fade-in cursor-pointer shadow-lg hover:shadow-cyan-500/20">
      <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80 z-10 pointer-events-none"></div>
      
      <div class="h-48 w-full bg-slate-800 relative overflow-hidden">
        <img 
          [ngSrc]="imageUrl()" 
          width="400" 
          height="300" 
          alt="Game Cover"
          class="object-cover w-full h-full opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-out"
        />
      </div>

      <div class="p-4 relative z-20 flex-1 flex flex-col transition-opacity duration-300 group-hover:opacity-60 hover:!opacity-100">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">{{ title() }}</h3>
          <span class="bg-cyan-900 text-cyan-200 text-xs px-2 py-1 rounded-full border border-cyan-700 shadow shadow-cyan-900/50">{{ rating() }}</span>
        </div>
        <p class="text-slate-300 text-sm mb-4 flex-1">{{ description() }}</p>
        <button class="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-white font-semibold text-sm hover:from-purple-500 hover:to-cyan-500 hover:scale-105 hover:shadow-cyan-500/50 transition-all duration-300 shadow-lg shadow-purple-900/20 active:scale-95">
          Ver Detalles
        </button>
      </div>
    </div>
  `
})
export class GameCardComponent {
  title = input.required<string>();
  description = input.required<string>();
  rating = input<string>('9.5');
  imageUrl = input<string>('https://picsum.photos/400/300');
}