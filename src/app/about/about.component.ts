import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  profile = {
    name: 'Rushikesh Narkhede',
    tagline: 'Software Developer | C# WPF Specialist | Exploring Generative AI',
    summary: `Passionate software developer with 3+ years of experience in building desktop and web applications.
Expert in C#, WPF, and industrial automation; actively exploring Generative AI and applying it to vision systems.`,
    location: 'Pune, Maharashtra',
    email: 'rushikeshnarkhede4@gmail.com',
    github: 'https://github.com/RushikeshNarkhedePatil',
    linkedin: 'https://www.linkedin.com/in/rushikeshnarkhede/',
    photoUrl: 'assets/profile.jpg'
  };

  skills = [
    'C#', 'WPF', 'Prism', 'HALCON', 'C', 'C++', 'Java', 'JavaScript', 'TypeScript',
    'Angular', 'MySQL', 'SQLite', 'MongoDB', 'Git', 'Machine Vision'
  ];

  experience = [
    {
      title: 'Software Developer',
      company: 'Varad Automation and Robotics Pvt. Ltd.',
      details: [
        'Developed vision-based industrial automation products',
        'Integrated OCR, calibration, measurement, and reporting modules',
        'Optimized image handling and reduced processing time'
      ]
    },
    {
      title: 'Projects',
      company: 'Visimaster / Counting Machine',
      details: [
        'Visimaster: General-purpose vision inspection software (traditional + deep learning)',
        'Counting Machine: Real-time counting using HALCON deep learning models'
      ]
    }
  ];

  constructor() { }

  ngOnInit(): void { }
}
