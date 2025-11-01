import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
//components
import { QuizComponent } from './quiz/quiz.component';
import { AboutComponent } from './about/about.component';
import { BlogComponent } from './blog/blog.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { BlogEditorComponent } from './blog-editor/blog-editor.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { AngularDemoComponent } from './angular-demo/angular-demo.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UploadComponent } from './upload/upload.component';
import { QuizAdminComponent } from './quiz-admin/quiz-admin.component';
import { CoursesComponent } from './courses/courses.component';
import { NotesComponent } from './notes/notes.component';
import { NotesUploadComponent } from './dashboard/notes-upload/notes-upload.component';
//import forms module
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AuthGuard } from './guards/auth.guard';

const appRoutes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'courses', component: CoursesComponent },
    { path: 'notes', component: NotesComponent },
    { path: 'blog', component: BlogComponent },
    { path: 'blog/:id', component: BlogDetailComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'quiz', component: QuizComponent },
    { path: 'dashboard/quiz-admin', component: QuizAdminComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
    { path: 'angular-demo', component: AngularDemoComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'instructor', 'user'] } },
    { path: 'dashboard/upload', component: UploadComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'instructor'] } },
    { path: 'dashboard/notes-upload', component: NotesUploadComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'instructor'] } },
    { path: 'dashboard/blog-editor', component: BlogEditorComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } }
];
@NgModule({
  declarations: [
    AppComponent,
    QuizComponent,
    AboutComponent,
    BlogComponent,
    ContactComponent,
    HomeComponent,
    AngularDemoComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    UploadComponent,
    QuizAdminComponent,
    BlogDetailComponent,
    BlogEditorComponent,
    CoursesComponent,
    NotesComponent,
    NotesUploadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatCardModule,
    MatListModule,
    MatSelectModule,
    MatSnackBarModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
