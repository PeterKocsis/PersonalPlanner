import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly AUTH_TOKEN_NAME = 'authToken';
  private readonly AUTH_TOKEN_EXPIRATION_NAME = 'authTokenExpiration';

  constructor() { }

  saveAuthData(token: string, expirationDate: Date): void {
    localStorage.setItem(this.AUTH_TOKEN_NAME, token);
    localStorage.setItem(this.AUTH_TOKEN_EXPIRATION_NAME, expirationDate.toISOString());
  }

  getAuthData(): {token: string, expireIn: number} | null {
    const expirationDate = localStorage.getItem(this.AUTH_TOKEN_EXPIRATION_NAME);
    const token = localStorage.getItem(this.AUTH_TOKEN_NAME);
    if (token && expirationDate) {
      const expireIn = new Date(expirationDate).getTime() - new Date().getTime();
      if (expireIn > 0) {
        return {
          token: token,
          expireIn: expireIn / 1000 // Convert to seconds
        };
      }
    }

    return null;
  }
  removeAuthData(): void {
    localStorage.removeItem(this.AUTH_TOKEN_NAME);
    localStorage.removeItem(this.AUTH_TOKEN_EXPIRATION_NAME);
  }
}
