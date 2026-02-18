import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-24 right-4 z-[100] flex flex-col gap-3 pointer-events-none max-w-[90vw] md:max-w-md">
      @for (toast of toastService.toasts(); track toast.id) {
        <div 
          class="pointer-events-auto p-4 rounded-xl shadow-2xl backdrop-blur-md border border-white/10 animate-slide-in-right transition-all duration-300 flex items-start gap-3"
          [class.bg-green-900_90]="toast.type === 'success'"
          [class.border-green-500_50]="toast.type === 'success'"
          [class.shadow-green-900_20]="toast.type === 'success'"
          
          [class.bg-red-900_90]="toast.type === 'error'"
          [class.border-red-500_50]="toast.type === 'error'"
          [class.shadow-red-900_20]="toast.type === 'error'"
          
          [class.bg-blue-900_90]="toast.type === 'info'"
          [class.border-blue-500_50]="toast.type === 'info'"
          [class.shadow-blue-900_20]="toast.type === 'info'"
        >
          <!-- Icon based on type -->
          <div class="mt-0.5 shrink-0">
            @if (toast.type === 'success') {
              <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            } @else if (toast.type === 'error') {
              <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            } @else {
              <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            }
          </div>

          <div class="flex-1">
            <p class="text-white text-sm font-medium leading-tight">{{ toast.message }}</p>
          </div>

          <button (click)="toastService.remove(toast.id)" class="text-white/50 hover:text-white transition-colors shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .animate-slide-in-right {
      animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}