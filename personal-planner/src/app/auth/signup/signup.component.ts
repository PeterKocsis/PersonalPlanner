import { Component, inject, OnDestroy, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatError } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatError,
    CommonModule,
    MatCardModule,
    RouterLink,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnDestroy {
  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);
  router = inject(Router)
  private createUserSub: Subscription | undefined;
  formErrorMessage = signal<string | undefined>(undefined);

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const password = form.value.password;
    this.createUserSub?.unsubscribe();
    this.createUserSub = this.authService
      .createUser(form.value.email, form.value.password)
      .subscribe({
        next: () => {
          console.log('User created successfuly');
          this.formErrorMessage.set(undefined);
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.formErrorMessage.set(error.error.message);
        },
      });
  }

  ngOnDestroy(): void {
    this.createUserSub?.unsubscribe();
  }
}
