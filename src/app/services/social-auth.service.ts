import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocialAuthService {
  constructor(private authService: AuthService) {
    if (!firebase.apps.length) {
      firebase.initializeApp(environment.firebase);
    }
  }

  async signInWithGoogle(): Promise<void> {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const credential = await firebase.auth().signInWithPopup(provider);
    if (!credential.user || !credential.user.email) {
      throw new Error('Unable to retrieve Google account details.');
    }

    await this.authService.socialLogin({
      id: credential.user.uid,
      email: credential.user.email,
      name: credential.user.displayName || 'Google User',
      provider: 'google',
      role: 'user'
    });
  }

  async signOut(): Promise<void> {
    await firebase.auth().signOut();
    this.authService.logout();
  }
}

