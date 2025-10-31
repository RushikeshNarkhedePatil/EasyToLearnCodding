import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, BlogContentSection } from '../services/auth.service';

@Component({
  selector: 'app-blog-editor',
  templateUrl: './blog-editor.component.html',
  styleUrls: ['./blog-editor.component.css']
})
export class BlogEditorComponent implements OnInit {
  form: FormGroup;
  error: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      coverImageUrl: [''],
      sections: this.fb.array([this.createSection('text')])
    });
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/blog']);
      return;
    }
  }

  get sections(): FormArray {
    return this.form.get('sections') as FormArray;
  }

  addSection(type: 'text' | 'code'): void {
    this.sections.push(this.createSection(type));
  }

  removeSection(index: number): void {
    if (this.sections.length === 1) {
      this.error = 'At least one section is required.';
      return;
    }
    this.sections.removeAt(index);
  }

  submit(): void {
    this.error = '';
    if (this.form.invalid) {
      this.error = 'Please fill in the required fields.';
      return;
    }

    const sections: BlogContentSection[] = this.sections.controls
      .map(ctrl => ctrl.value as BlogContentSection)
      .map(section => ({
        ...section,
        value: section.value?.trim() || '',
        language: section.type === 'code' ? (section.language || 'text') : undefined
      }))
      .filter(section => section.value.length > 0)
      .map(section => ({
        ...section,
        id: section.id || Date.now().toString() + Math.random().toString(36).slice(2, 8)
      }));

    if (sections.length === 0) {
      this.error = 'Add at least one text or code section for your blog.';
      return;
    }

    const plainContent = sections
      .filter(section => section.type === 'text')
      .map(section => section.value)
      .join('\n\n');

    const id = this.authService.addBlogPost({
      title: this.form.value.title,
      content: plainContent,
      coverImageUrl: this.form.value.coverImageUrl || undefined,
      sections
    });
    if (id) {
      this.router.navigate(['/blog', id]);
    }
  }

  private createSection(type: 'text' | 'code'): FormGroup {
    return this.fb.group({
      id: [Date.now().toString() + Math.random().toString(36).slice(2, 8)],
      type: [type, Validators.required],
      value: [''],
      language: [type === 'code' ? 'text' : null]
    });
  }
}


