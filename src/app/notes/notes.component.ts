import { Component, OnInit } from '@angular/core';
import { AuthService, NoteResource } from '../services/auth.service';

interface NoteDisplay {
  id: string;
  title: string;
  description?: string;
  category?: string;
  resourceType: string;
  fileUrl?: string;
  fileName: string;
  uploadedAt: Date;
  uploadedBy: string;
}

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  notes: NoteDisplay[] = [];
  isLoading = true;
  canManageNotes = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.canManageNotes = this.authService.hasAnyRole(['admin', 'instructor']);
    this.loadNotes();
  }

  loadNotes(): void {
    const resources = this.authService.getNotes();
    this.notes = resources.map(note => this.toDisplay(note));
    this.isLoading = false;
  }

  hasDownloads(): boolean {
    return this.notes.some(note => !!note.fileUrl);
  }

  private toDisplay(note: NoteResource): NoteDisplay {
    return {
      id: note.id,
      title: note.title,
      description: note.description,
      category: note.category,
      resourceType: note.resourceType,
      fileUrl: note.fileUrl,
      fileName: note.fileName,
      uploadedAt: new Date(note.uploadedAt),
      uploadedBy: note.uploadedBy
    };
  }
}

