import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, BlogPost } from '../services/auth.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  posts: BlogPost[] = [];
  filteredPosts: BlogPost[] = [];
  searchTerm = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.posts = this.authService.getBlogPosts().map(post => ({
      ...post,
      createdAt: new Date(post.createdAt),
      updatedAt: post.updatedAt ? new Date(post.updatedAt) : undefined
    }));
    this.filteredPosts = [...this.posts];
  }

  getExcerpt(content?: string, maxLen = 180): string {
    if (!content) return '';
    const clean = content.replace(/\s+/g, ' ').trim();
    return clean.length > maxLen ? clean.slice(0, maxLen) + '…' : clean;
  }

  getFirstTextSection(post: BlogPost): string {
    if (post.content) return post.content;
    const sections = post.sections || [];
    const textSection = sections.find(s => s.type === 'text');
    if (textSection) {
      return textSection.value;
    }
    const codeSection = sections.find(s => s.type === 'code');
    if (codeSection) {
      return codeSection.value;
    }
    return '';
  }

  openPost(id: string): void {
    this.router.navigate(['/blog', id]);
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    const normalized = term.trim().toLowerCase();
    if (!normalized) {
      this.filteredPosts = [...this.posts];
      return;
    }
    this.filteredPosts = this.posts.filter(post => {
      const title = post.title?.toLowerCase() || '';
      const content = this.getFirstTextSection(post)?.toLowerCase() || '';
      const combinedSections = (post.sections || [])
        .map(section => section.value.toLowerCase())
        .join(' ');
      return (
        title.includes(normalized) ||
        content.includes(normalized) ||
        combinedSections.includes(normalized)
      );
    });
  }

  isNew(post: BlogPost): boolean {
    const created = this.getCreatedDate(post);
    const daysSince = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince <= 7;
  }

  getCreatedDate(post: BlogPost): Date {
    return post.createdAt instanceof Date ? post.createdAt : new Date(post.createdAt);
  }
}
