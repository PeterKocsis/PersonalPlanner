import { HttpClient } from '@angular/common/http';
import { Injectable, input, signal } from '@angular/core';
import { IAuthData } from './auth.data.interface';
import { BehaviorSubject, Subject } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _token?: string;
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private _tokenTimer?: any;

  isLoggedInSignal = toSignal(this._isLoggedIn$, { initialValue: false });
  
  constructor(private http: HttpClient, private router: Router, private storageService: LocalStorageService) { }

  get jwtToken() {
    return this._token;
  }
  
  login(email: any, password: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const authData : IAuthData = {
        email: email,
        password: password
      }
      this.http.post<{token: string, expiresIn: number}>("http://localhost:3000/api/user/login", authData)
        .subscribe({
          next: (response) => {
            console.log("User logged in successfully", response);
            if (response.token) {
              this._token = response.token;
              this._tokenTimer = setTimeout(() => {
                this.logout();
              }, response.expiresIn * 1000);
              this._isLoggedIn$.next(true);
              this.storageService.saveAuthData(this._token, new Date(new Date().getTime() + response.expiresIn * 1000));
              this.router.navigate(['/']);
              resolve(true);
            }
            else {
              console.error("No token received");
              this._token = undefined;
              this._isLoggedIn$.next(false);
              resolve(false);
            }
          }
          , error: (error) => {
            console.error("Error logging in user", error);
            resolve(false);  
          }
        }); 
    });
  }

  logout() {
    this._token = undefined;
    this._isLoggedIn$.next(false);
    this.storageService.removeAuthData();
    clearTimeout(this._tokenTimer);
    this.router.navigate(['/auth/login']);
  }

  createUser(email: string, password: string) {
    const authData : IAuthData = {
      email: email,
      password: password
    }
    this.http.post("http://localhost:3000/api/user/signup", authData)
      .subscribe({
        next: (response) => {
          console.log("User created successfully", response);
        }
        , error: (error) => {
          console.error("Error creating user", error);
        }
      });
  }

  autoLogin() {
    const authData = this.storageService.getAuthData();
    if (authData) {
      this._token = authData.token;
      this._isLoggedIn$.next(true);
      this._tokenTimer = setTimeout(() => {
        this.logout();
      }, authData.expireIn * 1000);
    }
  }
}
