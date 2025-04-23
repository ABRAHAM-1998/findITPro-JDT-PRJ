import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ViewDetailsComponent } from './view-details/view-details.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthGuard } from './auth.guard';
import { ContactsComponent } from './contacts/contacts.component';
import { ChatComponent } from './chat/chat.component';
import { RequestsComponent } from './requests/requests.component';
import { SupportComponent } from './support/support.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { HelpMessagesComponent } from './help-messages/help-messages.component';
import { NotificationComponent } from './notification/notification.component';
import { ChatCompComponent } from './chat-comp/chat-comp.component';

const routes: Routes = [
  {path:'',redirectTo:'welcome',pathMatch:'full'},
  {path:'welcome',component:WelcomeComponent},
  {path:'register',component:RegisterComponent},
  {path:'home',component:HomeComponent,canActivate:[AuthGuard]},
  {path:'view-details',component:ViewDetailsComponent,canActivate:[AuthGuard]},
  {path:'admin',component:AdminComponent,canActivate:[AuthGuard]},
  {path:'login',component:LoginComponent},
  {path:'sign-up',component:SignUpComponent},
  {path:'contacts',component:ContactsComponent,canActivate:[AuthGuard]},
  {path:'requests',component:RequestsComponent,canActivate:[AuthGuard]},
  {path:'chat',component:ChatComponent,canActivate:[AuthGuard]},
  {path:'chat-list',component:ChatCompComponent,canActivate:[AuthGuard]},

  {path:'help&support',component:SupportComponent,canActivate:[AuthGuard]},
  {path:'profile',component:ProfileComponent,canActivate:[AuthGuard]},
  {path:'settings',component:SettingsComponent,canActivate:[AuthGuard]},
  {path:'helpMessages',component:HelpMessagesComponent,canActivate:[AuthGuard]},
  {path:'notification-sent',component:NotificationComponent,canActivate:[AuthGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
