import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SocialAuthService } from '../services/social-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  returnUrl: string = '';
  hidePassword: boolean = true;
  isSocialLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private socialAuth: SocialAuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    
    // If already logged in, redirect
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      if (this.authService.login(email, password)) {
        const user = this.authService.getCurrentUser();
        // Navigate to dashboard for all users; 'returnUrl' already defaults to '/dashboard'
        this.router.navigate([this.returnUrl || '/dashboard']);
      } else {
        this.errorMessage = 'Invalid email or password';
      }
    }
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  async onGoogleSignIn(): Promise<void> {
    this.errorMessage = '';
    this.isSocialLoading = true;
    try {
      await this.socialAuth.signInWithGoogle();
      this.router.navigate([this.returnUrl || '/dashboard']);
    } catch (error) {
      this.errorMessage = 'Google sign-in failed. Please try again.';
    } finally {
      this.isSocialLoading = false;
    }
  }
}

