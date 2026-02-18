import { Injectable, signal } from '@angular/core';

export interface UserProfile {
  name: string;
  genres: string[];
  gamertag?: string;
  bio?: string;
  recommendations?: Array<{
    title: string;
    reason: string;
    genre?: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signals for reactive state
  currentUser = signal<UserProfile | null>(null);
  isLoggedIn = signal<boolean>(false);

  login(user: UserProfile) {
    this.currentUser.set(user);
    this.isLoggedIn.set(true);
  }

  logout() {
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
  }
}