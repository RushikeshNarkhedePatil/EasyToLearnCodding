import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, BlogContentSection, BlogPost } from '../services/auth.service';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit {
  post?: BlogPost;

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/blog']);
      return;
    }
    const found = this.authService.getBlogPostById(id);
    if (!found) {
      this.router.navigate(['/blog']);
      return;
    }
    this.post = {
      ...found,
      createdAt: new Date(found.createdAt),
      updatedAt: found.updatedAt ? new Date(found.updatedAt) : undefined,
      sections: (found.sections || []).map(section => this.normalizeSection(section))
    };
  }

  goBack(): void {
    this.router.navigate(['/blog']);
  }

  private normalizeSection(section: BlogContentSection): BlogContentSection {
    return {
      id: section.id || Date.now().toString(),
      type: section.type,
      value: section.value,
      language: section.language
    };
  }
}


