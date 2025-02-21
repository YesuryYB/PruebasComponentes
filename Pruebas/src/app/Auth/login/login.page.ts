import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, NavController, ToastController, IonLabel, IonItem, IonButton, IonInputPasswordToggle, IonInput } from '@ionic/angular/standalone';
import { fetchSignInMethodsForEmail, getAuth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { initializeApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonInputPasswordToggle, IonInput, IonButton, IonItem, IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, ReactiveFormsModule]
})
export class LoginPage{
  userExists = signal(true);
  loginForm: FormGroup;
  private auth = getAuth(initializeApp(environment.firebase));
  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

async checkUserExist(){
  const email_validar = this.loginForm.value.email;
  if(email_validar){
    const method = await fetchSignInMethodsForEmail(this.auth, email_validar);
    this.userExists.set(method.length>0);
  }
}

  async login() {
    await this.checkUserExist();
    if(!this.userExists()){
      const toast = await this.toastCtrl.create({
        message: 'El usuario no se encuentra registrado',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      
      try {
        await signInWithEmailAndPassword(this.auth, email, password);
        this.navCtrl.navigateRoot('/home');
      } catch (error:any) {
        const toast = await this.toastCtrl.create({
          message: error.message || 'Error al iniciar sesión',
          duration: 2000,
          color: 'danger',
        });
        await toast.present();
      }
    }
  }

  navigateToRegister() {
    this.navCtrl.navigateForward('/register');
  }

}
