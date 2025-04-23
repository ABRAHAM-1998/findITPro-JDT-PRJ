import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ViewDetailsComponent } from './view-details/view-details.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import{FIREBASE_OPTIONS } from '@angular/fire/compat';
import { ContactsComponent } from './contacts/contacts.component';
import { ChatComponent } from './chat/chat.component';
import { RequestsComponent } from './requests/requests.component';
import { ChatCompComponent } from './chat-comp/chat-comp.component';
import { SupportComponent } from './support/support.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { HelpMessagesComponent } from './help-messages/help-messages.component';
import { NotificationComponent } from './notification/notification.component';
export const firebaseConfig = {
  apiKey: "AIzaSyA_Exs4Q8aTHWvZIzPRKRKBWovKg_MRfPg",
  authDomain: "finditpro.firebaseapp.com",
  projectId: "finditpro",
  storageBucket: "finditpro.firebasestorage.app",
  messagingSenderId: "73483727873",
  appId: "1:73483727873:web:51c9a25ab4d39d2926fc00"
};
@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    RegisterComponent,
    HomeComponent,
    ViewDetailsComponent,
    AdminComponent,
    LoginComponent,
    SignUpComponent,
    ContactsComponent,
    ChatComponent,
    RequestsComponent,
    ChatCompComponent,
    SupportComponent,
    ProfileComponent,
    SettingsComponent,
    HelpMessagesComponent,
    NotificationComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    RouterModule
  ],
  providers: [
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    {provide:FIREBASE_OPTIONS,useValue:firebaseConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

