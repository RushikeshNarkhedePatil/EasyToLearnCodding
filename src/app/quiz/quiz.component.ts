import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, QuizQuestion } from '../services/auth.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})

export class QuizComponent implements OnInit, OnDestroy {
  questions: QuizQuestion[] = [];
  answers: number[] = [];
  submitted = false;
  score?: { correct: number; total: number };
  reviewMode = false;
  currentQuestionIndex = 0;
  elapsedSeconds = 0;
  timeTakenSeconds = 0;
  private timerId: any;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.questions = this.auth.getQuizQuestions();
    this.answers = new Array(this.questions.length).fill(-1);
    if (this.questions.length > 0) {
      this.startTimer();
    }
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  get currentQuestion(): QuizQuestion | undefined {
    return this.questions[this.currentQuestionIndex];
  }

  get isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.questions.length - 1;
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.elapsedSeconds / 60);
    const seconds = this.elapsedSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  get formattedFinalTime(): string {
    const minutes = Math.floor(this.timeTakenSeconds / 60);
    const seconds = this.timeTakenSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  get percentageScore(): number {
    if (!this.score) return 0;
    return Math.round((this.score.correct / this.score.total) * 100);
  }

  get resultMessage(): string {
    if (!this.score) return '';
    const percent = this.percentageScore;
    if (percent === 100) return 'Perfect score! Fantastic job!';
    if (percent >= 80) return 'Great work! You really know your stuff.';
    if (percent >= 50) return 'Nice effort! Keep practicing to improve further.';
    return 'Keep studying! Review the answers and try again.';
  }

  selectAnswer(optionIndex: number): void {
    this.answers[this.currentQuestionIndex] = optionIndex;
  }

  nextQuestion(): void {
    if (this.isLastQuestion) {
      this.submitQuiz();
      return;
    }
    this.currentQuestionIndex++;
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex === 0) return;
    this.currentQuestionIndex--;
  }

  submitQuiz(): void {
    if (this.questions.length === 0) return;
    const attempt = this.auth.addQuizAttempt(this.answers);
    const result = attempt ?? {
      score: this.calculateScore(),
      total: this.questions.length
    };

    this.submitted = true;
    this.score = { correct: result.score, total: result.total };
    this.reviewMode = false;
    this.timeTakenSeconds = this.elapsedSeconds;
    this.stopTimer();
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  tryAgain(): void {
    this.submitted = false;
    this.reviewMode = false;
    this.score = undefined;
    this.answers = new Array(this.questions.length).fill(-1);
    this.currentQuestionIndex = 0;
    this.elapsedSeconds = 0;
    this.timeTakenSeconds = 0;
    if (this.questions.length > 0) {
      this.startTimer();
    }
  }

  toggleReview(): void {
    this.reviewMode = !this.reviewMode;
  }

  private startTimer(): void {
    this.stopTimer();
    this.elapsedSeconds = 0;
    this.timerId = setInterval(() => {
      this.elapsedSeconds += 1;
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = undefined;
    }
  }

  private calculateScore(): number {
    return this.questions.reduce((acc, q, index) => {
      return acc + (this.answers[index] === q.correctIndex ? 1 : 0);
    }, 0);
  }
}
