import { Component } from '@angular/core';

interface CourseModule {
  title: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  topics: string[];
}

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent {
  featuredCourses: CourseModule[] = [
    {
      title: 'C Programming Fundamentals',
      description: 'Learn the building blocks of C including variables, control statements, functions, and pointers with hands-on examples.',
      duration: '4 weeks',
      level: 'Beginner',
      topics: ['Data types', 'Loops & conditionals', 'Functions', 'Pointers', 'Arrays & strings']
    },
    {
      title: 'Object-Oriented Java',
      description: 'Master Java OOP concepts while building console and GUI applications, and learn essential libraries used in the industry.',
      duration: '6 weeks',
      level: 'Intermediate',
      topics: ['Classes & objects', 'Inheritance', 'Interfaces', 'Collections', 'Exception handling']
    },
    {
      title: 'Full-Stack Web with Angular',
      description: 'Create responsive web applications using Angular on the front-end and explore REST APIs integration with Node/Express.',
      duration: '8 weeks',
      level: 'Advanced',
      topics: ['Angular fundamentals', 'RxJS', 'Component design', 'REST APIs', 'Deployment']
    }
  ];
}

