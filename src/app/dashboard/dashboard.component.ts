import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService, ContentItem } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  contentItems: ContentItem[] = [];
  filteredItems: ContentItem[] = [];
  filterType: 'all' | 'video' | 'image' | 'video-link' = 'all';

  quizResults: { score: number; total: number; attemptedAt: Date }[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadContent();
    this.loadQuizResults();
  }

  loadContent(): void {
    this.contentItems = this.authService.getContent();
    // For non-admins, show published items and also user's own drafts
    if (this.currentUser.role !== 'admin') {
      this.contentItems = this.contentItems.filter(item => {
        const isPublished = item.status === 'published';
        const isUsersOwnDraft = item.uploadedBy === this.currentUser.id;
        return isPublished || isUsersOwnDraft;
      });
    }
    this.applyFilter();
  }

  loadQuizResults(): void {
    if (!this.currentUser) return;
    const attempts = this.authService.getQuizAttemptsByUser(this.currentUser.id);
    this.quizResults = attempts.map(a => ({ score: a.score, total: a.total, attemptedAt: new Date(a.attemptedAt) }));
  }

  applyFilter(): void {
    if (this.filterType === 'all') {
      this.filteredItems = this.contentItems;
    } else {
      this.filteredItems = this.contentItems.filter(item => item.type === this.filterType);
    }
  }

  onFilterChange(type: 'all' | 'video' | 'image' | 'video-link'): void {
    this.filterType = type;
    this.applyFilter();
  }

  deleteContent(id: string): void {
    if (confirm('Are you sure you want to delete this content?')) {
      this.authService.deleteContent(id);
      this.loadContent();
    }
  }

  publishContent(id: string): void {
    this.authService.updateContent(id, { status: 'published' });
    this.loadContent();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  logout(): void {
    this.authService.logout();
  }

  getEmbedUrl(url: string): any {
    if (!url) return '';
    // Convert YouTube/other video URLs to embed format
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  openPreview(item: ContentItem): void {
    // For images, we can implement a modal preview
    // This is a simple implementation - could be enhanced with a modal dialog
    window.open(item.fileUrl, '_blank');
  }
}

