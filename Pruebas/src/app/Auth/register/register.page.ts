import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonInput, IonLabel, NavController, ToastController, IonInputPasswordToggle, IonButton, IonText } from '@ionic/angular/standalone';
import { getAuth } from '@angular/fire/auth';
import { createUserWithEmailAndPassword, onAuthStateChanged, User } from '@firebase/auth';
import { initializeApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonText, IonButton, IonLabel, IonInput, IonInputPasswordToggle, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, ReactiveFormsModule]
})
export class RegisterPage implements OnInit{
  formRegister: FormGroup;
  userSignal = signal<User | null>(null);
  private auth = getAuth(initializeApp(environment.firebase));
  constructor(private fb: FormBuilder, private navCtrl: NavController, private toastCtrl: ToastController) { 
    
    this.formRegister = this.fb.group({
      email: ['',[Validators.email, Validators.required]],
      password: ['', Validators.required],
      cpassword: ['', Validators.required]
    });
    
    
  }
ngOnInit(): void {
  onAuthStateChanged(this.auth, (user) => {
    this.userSignal.set(user);
  });
}
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')!.value === form.get('confirmPassword')!.value
      ? null : { mismatch: true };
  }

  async register(){
    
    onAuthStateChanged(this.auth, (user) => {
      this.userSignal.set(user);
    });
    console.log("El usuario esta registrado: ", this.isUserUnregistered())
    if (this.formRegister.valid) {
          const { email, password } = this.formRegister.value;
          //const auth = getAuth();
          try {
            await createUserWithEmailAndPassword(this.auth, email, password);
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

  isUserUnregistered() {
    return this.userSignal() === null;
  }

}
