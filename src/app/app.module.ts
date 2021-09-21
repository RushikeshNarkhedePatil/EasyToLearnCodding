import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes,RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//material
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import { QuizComponent } from './quiz/quiz.component';
import { AboutComponent } from './about/about.component';
import { BlogComponent } from './blog/blog.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
//import forms module
import { FormsModule } from '@angular/forms';
import { AngularDemoComponent } from './angular-demo/angular-demo.component';

const appRoutes:Routes=[
    {path:'home',component:HomeComponent},
    {path:'about',component:AboutComponent},
    {path:'blog',component:BlogComponent},
    {path:'contact',component:ContactComponent},
    {path:'quiz',component:QuizComponent},
    {path:'angular-demo',component:AngularDemoComponent}
]
@NgModule({
  declarations: [
    AppComponent,
    QuizComponent,
    AboutComponent,
    BlogComponent,
    ContactComponent,
    HomeComponent,
    AngularDemoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    RouterModule.forRoot(appRoutes),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
