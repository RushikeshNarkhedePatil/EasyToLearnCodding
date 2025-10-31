import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AuthService, QuizQuestion } from '../services/auth.service';

@Component({
  selector: 'app-quiz-admin',
  templateUrl: './quiz-admin.component.html',
  styleUrls: ['./quiz-admin.component.css']
})
export class QuizAdminComponent implements OnInit {
  form: FormGroup;
  questions: QuizQuestion[] = [];
  editingId: string | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.fb.group({
      question: ['', [Validators.required, Validators.minLength(5)]],
      options: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control(''),
        this.fb.control('')
      ]),
      correctIndex: [0, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.refresh();
  }

  get options(): FormArray { return this.form.get('options') as FormArray; }

  addOption(): void {
    if (this.options.length < 6) this.options.push(this.fb.control(''));
  }

  removeOption(i: number): void {
    if (this.options.length > 2) {
      this.options.removeAt(i);
      const current = this.form.value.correctIndex ?? 0;
      const lastIndex = this.options.length - 1;
      // If the removed option was before or equal to current, shift left
      if (current === i) {
        this.form.patchValue({ correctIndex: Math.min(i, lastIndex) });
      } else if (current > i) {
        this.form.patchValue({ correctIndex: current - 1 });
      } else if (current > lastIndex) {
        this.form.patchValue({ correctIndex: lastIndex });
      }
    }
  }

  addQuestion(): void {
    if (this.form.invalid) return;
    const options = this.options.value.filter((v: string) => v && v.trim().length > 0);
    const idx = this.form.value.correctIndex;
    const mappedIdx = Math.min(idx, options.length - 1);

    if (this.editingId) {
      // Save edits
      this.auth.updateQuizQuestion(this.editingId, {
        question: this.form.value.question,
        options,
        correctIndex: mappedIdx
      });
      this.editingId = null;
    } else {
      // Add new
      this.auth.addQuizQuestion({
        question: this.form.value.question,
        options,
        correctIndex: mappedIdx
      });
    }

    this.resetForm();
    this.refresh();
  }

  deleteQuestion(id: string): void {
    this.auth.deleteQuizQuestion(id);
    this.refresh();
  }

  private refresh(): void {
    this.questions = this.auth.getQuizQuestions();
  }

  editQuestion(q: QuizQuestion): void {
    this.editingId = q.id;
    // Populate form
    this.form.patchValue({ question: q.question, correctIndex: q.correctIndex });
    this.setOptions(q.options);
  }

  cancelEdit(): void {
    this.editingId = null;
    this.resetForm();
  }

  private setOptions(options: string[]): void {
    while (this.options.length > 0) this.options.removeAt(0);
    options.forEach(opt => this.options.push(this.fb.control(opt)));
    if (this.options.length < 2) {
      while (this.options.length < 2) this.options.push(this.fb.control(''));
    }
    const idx = this.form.value.correctIndex ?? 0;
    const lastIndex = this.options.length - 1;
    if (idx > lastIndex) this.form.patchValue({ correctIndex: lastIndex });
  }

  private resetForm(): void {
    this.form.reset({ question: '', correctIndex: 0 });
    while (this.options.length > 2) this.options.removeAt(this.options.length - 1);
    this.options.at(0).setValue('');
    this.options.at(1).setValue('');
  }

  setCorrect(i: number): void {
    this.form.patchValue({ correctIndex: i });
  }
}


