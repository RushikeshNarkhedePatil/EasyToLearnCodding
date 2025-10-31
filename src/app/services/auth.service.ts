import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  name: string;
}

export interface ContentItem {
  id: string;
  type: 'video' | 'image' | 'video-link';
  title: string;
  description?: string;
  url?: string; // For video links
  fileUrl?: string; // For uploaded files
  thumbnailUrl?: string;
  uploadedBy: string;
  uploadedAt: Date;
  status: 'draft' | 'published';
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  coverImageUrl?: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt?: Date;
  sections?: BlogContentSection[];
}

export interface BlogContentSection {
  id: string;
  type: 'text' | 'code';
  value: string;
  language?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  score: number;
  total: number;
  answers: number[];
  attemptedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  private usersKey = 'easyToLearn_users';
  private currentUserKey = 'easyToLearn_currentUser';
  private contentKey = 'easyToLearn_content';
  private blogKey = 'easyToLearn_blog_posts';
  private quizQuestionsKey = 'easyToLearn_quiz_questions';
  private quizAttemptsKey = 'easyToLearn_quiz_attempts';

  constructor(private router: Router) {
    // Initialize users if not exist
    if (!localStorage.getItem(this.usersKey)) {
      const defaultUsers: User[] = [
        {
          id: '1',
          email: 'admin@easytocode.com',
          password: 'admin123',
          role: 'admin',
          name: 'Admin User'
        },
        {
          id: '2',
          email: 'user@easytocode.com',
          password: 'user123',
          role: 'user',
          name: 'Regular User'
        }
      ];
      localStorage.setItem(this.usersKey, JSON.stringify(defaultUsers));
    }

    const savedUser = localStorage.getItem(this.currentUserKey);
    this.currentUserSubject = new BehaviorSubject<User | null>(
      savedUser ? JSON.parse(savedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  login(email: string, password: string): boolean {
    const users: User[] = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem(this.currentUserKey, JSON.stringify(user));
      this.currentUserSubject.next(user);
      return true;
    }
    return false;
  }

  register(email: string, password: string, name: string): boolean {
    const users: User[] = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    
    if (users.some(u => u.email === email)) {
      return false; // User already exists
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      password,
      role: 'user',
      name
    };

    users.push(newUser);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    return true;
  }

  logout(): void {
    localStorage.removeItem(this.currentUserKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }

  // Content Management Methods
  getContent(): ContentItem[] {
    const content = localStorage.getItem(this.contentKey);
    return content ? JSON.parse(content) : [];
  }

  addContent(item: Omit<ContentItem, 'id' | 'uploadedBy' | 'uploadedAt'>): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    const content = this.getContent();
    const newItem: ContentItem = {
      ...item,
      id: Date.now().toString(),
      uploadedBy: user.id,
      uploadedAt: new Date()
    };

    content.push(newItem);
    localStorage.setItem(this.contentKey, JSON.stringify(content));
    return true;
  }

  updateContent(id: string, updates: Partial<ContentItem>): boolean {
    const content = this.getContent();
    const index = content.findIndex(item => item.id === id);
    
    if (index === -1) return false;
    
    content[index] = { ...content[index], ...updates };
    localStorage.setItem(this.contentKey, JSON.stringify(content));
    return true;
  }

  deleteContent(id: string): boolean {
    const content = this.getContent();
    const filtered = content.filter(item => item.id !== id);
    localStorage.setItem(this.contentKey, JSON.stringify(filtered));
    return true;
  }

  getContentById(id: string): ContentItem | undefined {
    return this.getContent().find(item => item.id === id);
  }

  // File upload simulation (in real app, this would upload to server)
  uploadFile(file: File, type: 'video' | 'image'): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        // In a real application, this would upload to a server
        // For demo, we'll create a data URL
        const fileUrl = reader.result as string;
        resolve(fileUrl);
      };
      reader.readAsDataURL(file);
    });
  }

  // Blog Methods
  getBlogPosts(): BlogPost[] {
    const posts = localStorage.getItem(this.blogKey);
    return posts ? JSON.parse(posts) : [];
  }

  // Quiz Methods
  getQuizQuestions(): QuizQuestion[] {
    const data = localStorage.getItem(this.quizQuestionsKey);
    return data ? JSON.parse(data) : [];
  }

  addQuizQuestion(q: Omit<QuizQuestion, 'id'>): string | null {
    if (!this.isAdmin()) return null;
    const list = this.getQuizQuestions();
    const newQ: QuizQuestion = { ...q, id: Date.now().toString() };
    list.push(newQ);
    localStorage.setItem(this.quizQuestionsKey, JSON.stringify(list));
    return newQ.id;
  }

  updateQuizQuestion(id: string, updates: Partial<QuizQuestion>): boolean {
    if (!this.isAdmin()) return false;
    const list = this.getQuizQuestions();
    const idx = list.findIndex(x => x.id === id);
    if (idx === -1) return false;
    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(this.quizQuestionsKey, JSON.stringify(list));
    return true;
  }

  deleteQuizQuestion(id: string): boolean {
    if (!this.isAdmin()) return false;
    const list = this.getQuizQuestions().filter(x => x.id !== id);
    localStorage.setItem(this.quizQuestionsKey, JSON.stringify(list));
    return true;
  }

  addQuizAttempt(answers: number[]): QuizAttempt | null {
    const user = this.getCurrentUser();
    if (!user) return null;
    const questions = this.getQuizQuestions();
    const total = questions.length;
    const score = questions.reduce((acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0), 0);
    const attempt: QuizAttempt = {
      id: Date.now().toString(),
      userId: user.id,
      score,
      total,
      answers,
      attemptedAt: new Date()
    };
    const existing: QuizAttempt[] = JSON.parse(localStorage.getItem(this.quizAttemptsKey) || '[]');
    existing.unshift(attempt);
    localStorage.setItem(this.quizAttemptsKey, JSON.stringify(existing));
    return attempt;
  }

  getQuizAttemptsByUser(userId: string): QuizAttempt[] {
    const existing: QuizAttempt[] = JSON.parse(localStorage.getItem(this.quizAttemptsKey) || '[]');
    return existing.filter(a => a.userId === userId);
  }

  getBlogPostById(id: string): BlogPost | undefined {
    return this.getBlogPosts().find(p => p.id === id);
  }

  addBlogPost(post: Omit<BlogPost, 'id' | 'authorId' | 'authorName' | 'createdAt' | 'updatedAt'>): string | null {
    const user = this.getCurrentUser();
    if (!user) return null;
    const posts = this.getBlogPosts();
    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString(),
      authorId: user.id,
      authorName: user.name,
      createdAt: new Date()
    };
    posts.unshift(newPost);
    localStorage.setItem(this.blogKey, JSON.stringify(posts));
    return newPost.id;
  }

  updateBlogPost(id: string, updates: Partial<BlogPost>): boolean {
    const posts = this.getBlogPosts();
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) return false;
    posts[index] = { ...posts[index], ...updates, updatedAt: new Date() };
    localStorage.setItem(this.blogKey, JSON.stringify(posts));
    return true;
  }

  deleteBlogPost(id: string): boolean {
    const posts = this.getBlogPosts().filter(p => p.id !== id);
    localStorage.setItem(this.blogKey, JSON.stringify(posts));
    return true;
  }
}

