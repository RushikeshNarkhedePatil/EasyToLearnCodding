import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, ContentItem } from '../services/auth.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  uploadForm: FormGroup;
  selectedFiles: File[] = [];
  uploadedFiles: { file: File, url: string }[] = [];
  isDragging: boolean = false;
  uploadType: 'video-link' | 'video' | 'image' = 'video-link';
  uploadProgress: { [key: string]: number } = {};
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.uploadForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      url: ['']
    });
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
    this.setupUrlValidation();
  }

  setupUrlValidation(): void {
    const urlControl = this.uploadForm.get('url');
    this.uploadForm.get('uploadType')?.valueChanges.subscribe(type => {
      if (type === 'video-link') {
        urlControl?.setValidators([Validators.required]);
      } else {
        urlControl?.clearValidators();
      }
      urlControl?.updateValueAndValidity();
    });
  }

  onUploadTypeChange(type: 'video-link' | 'video' | 'image'): void {
    this.uploadType = type;
    this.selectedFiles = [];
    this.uploadedFiles = [];
    this.uploadForm.patchValue({ url: '' });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFiles(Array.from(files));
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFiles(Array.from(input.files));
    }
  }

  handleFiles(files: File[]): void {
    const allowedTypes = this.uploadType === 'image' 
      ? ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      : ['video/mp4', 'video/webm', 'video/ogg'];

    const validFiles = files.filter(file => {
      if (allowedTypes.includes(file.type)) {
        return true;
      }
      return false;
    });

    if (validFiles.length !== files.length) {
      this.errorMessage = 'Some files were rejected. Please ensure they match the selected type.';
    }

    this.selectedFiles = [...this.selectedFiles, ...validFiles];
    this.uploadFiles();
  }

  async uploadFiles(): Promise<void> {
    for (const file of this.selectedFiles) {
      if (!this.uploadedFiles.some(f => f.file === file)) {
        try {
          this.uploadProgress[file.name] = 0;
          // Simulate upload progress
          const progressInterval = setInterval(() => {
            if (this.uploadProgress[file.name] < 90) {
              this.uploadProgress[file.name] += 10;
            }
          }, 200);

          const inferredType: 'video' | 'image' = this.uploadType === 'image' ? 'image' : 'video';
          const url = await this.authService.uploadFile(file, inferredType);
          
          clearInterval(progressInterval);
          this.uploadProgress[file.name] = 100;
          this.uploadedFiles.push({ file, url });
          
          // Remove from selectedFiles after upload
          this.selectedFiles = this.selectedFiles.filter(f => f !== file);
          delete this.uploadProgress[file.name];
        } catch (error) {
          this.errorMessage = `Error uploading ${file.name}`;
        }
      }
    }
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }

  async onSubmit(): Promise<void> {
    if (this.uploadForm.invalid) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    if (this.uploadType === 'video-link') {
      if (!this.uploadForm.value.url) {
        this.errorMessage = 'Please provide a video URL';
        return;
      }

      const contentItem: Omit<ContentItem, 'id' | 'uploadedBy' | 'uploadedAt'> = {
        type: 'video-link',
        title: this.uploadForm.value.title,
        description: this.uploadForm.value.description,
        url: this.uploadForm.value.url,
        status: this.authService.isAdmin() ? 'published' : 'draft'
      };

      if (this.authService.addContent(contentItem)) {
        this.successMessage = 'Content added successfully!';
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      }
    } else {
      if (this.uploadedFiles.length === 0) {
        this.errorMessage = 'Please upload at least one file';
        return;
      }

      // Add each uploaded file as separate content item
      for (const uploadedFile of this.uploadedFiles) {
        const contentItem: Omit<ContentItem, 'id' | 'uploadedBy' | 'uploadedAt'> = {
          type: this.uploadType,
          title: `${this.uploadForm.value.title}${this.uploadedFiles.length > 1 ? ` (${this.uploadedFiles.indexOf(uploadedFile) + 1})` : ''}`,
          description: this.uploadForm.value.description,
          fileUrl: uploadedFile.url,
          status: this.authService.isAdmin() ? 'published' : 'draft'
        };

        this.authService.addContent(contentItem);
      }

      this.successMessage = 'Content uploaded successfully!';
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1500);
    }
  }

  get title() { return this.uploadForm.get('title'); }
  get url() { return this.uploadForm.get('url'); }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

