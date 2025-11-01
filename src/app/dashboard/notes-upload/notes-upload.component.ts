import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, NoteResourceType } from '../../services/auth.service';

@Component({
  selector: 'app-notes-upload',
  templateUrl: './notes-upload.component.html',
  styleUrls: ['./notes-upload.component.css']
})
export class NotesUploadComponent implements OnInit {
  noteForm: FormGroup;
  selectedFile?: File;
  uploadPreview?: { name: string; size: string; type: string };
  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  readonly resourceTypes: NoteResourceType[] = ['PDF', 'Cheatsheet', 'Worksheet', 'Slides', 'Other'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.noteForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      category: [''],
      resourceType: ['PDF', Validators.required]
    });
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    if (!this.authService.hasAnyRole(['admin', 'instructor'])) {
      this.router.navigate(['/dashboard']);
      return;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    const file = input.files[0];
    if (!this.isAllowedFile(file)) {
      this.errorMessage = 'Unsupported file format. Upload PDF, DOCX, PPTX, or text notes.';
      this.selectedFile = undefined;
      this.uploadPreview = undefined;
      return;
    }
    this.errorMessage = '';
    this.selectedFile = file;
    this.uploadPreview = {
      name: file.name,
      size: this.formatFileSize(file.size),
      type: file.type || 'Unknown'
    };
  }

  async submit(): Promise<void> {
    this.errorMessage = '';
    if (this.noteForm.invalid) {
      this.errorMessage = 'Please fill in the required fields.';
      return;
    }
    if (!this.selectedFile) {
      this.errorMessage = 'Attach a note file before publishing.';
      return;
    }

    this.isSubmitting = true;
    try {
      const fileUrl = await this.authService.uploadFile(this.selectedFile, 'document');
      const saved = this.authService.addNote({
        title: this.noteForm.value.title,
        description: this.noteForm.value.description,
        category: this.noteForm.value.category,
        resourceType: this.noteForm.value.resourceType,
        fileUrl,
        fileName: this.selectedFile.name,
        fileType: this.selectedFile.type || 'application/octet-stream'
      });

      if (saved) {
        this.successMessage = 'Note uploaded successfully!';
        setTimeout(() => {
          this.router.navigate(['/notes']);
        }, 1500);
      } else {
        this.errorMessage = 'Unable to save note. Please ensure you have admin access.';
      }
    } catch (error) {
      this.errorMessage = 'Something went wrong while uploading the file. Try again.';
    } finally {
      this.isSubmitting = false;
    }
  }

  removeSelectedFile(): void {
    this.selectedFile = undefined;
    this.uploadPreview = undefined;
  }

  private isAllowedFile(file: File): boolean {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ];
    const allowedExtensions = ['pdf', 'ppt', 'pptx', 'doc', 'docx', 'txt'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    return allowedTypes.includes(file.type) || (extension ? allowedExtensions.includes(extension) : false);
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  get title() { return this.noteForm.get('title'); }
  get resourceType() { return this.noteForm.get('resourceType'); }
}

