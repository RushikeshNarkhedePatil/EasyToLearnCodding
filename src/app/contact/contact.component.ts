import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  submitted: boolean = false;
  successMessage: string = '';

  profile = {
    name: 'Rushikesh Narkhede',
    role: 'Software Developer | C# WPF Specialist | Exploring Generative AI',
    location: 'Pune, Maharashtra',
    email: 'rushikeshnarkhede4@gmail.com',
    github: 'https://github.com/RushikeshNarkhedePatil',
    linkedin: 'https://www.linkedin.com/in/rushikeshnarkhede/'
  };

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {}

  submit(): void {
    this.submitted = true;
    if (this.contactForm.invalid) {
      return;
    }
    const { name, email, message } = this.contactForm.value;
    const subject = encodeURIComponent(`Contact from ${name}`);
    const body = encodeURIComponent(`From: ${name} <${email}>\n\n${message}`);
    // Open default mail client
    window.location.href = `mailto:${this.profile.email}?subject=${subject}&body=${body}`;
    this.successMessage = 'Thanks! Your email client should open now.';
    this.contactForm.reset();
    this.submitted = false;
  }
}
