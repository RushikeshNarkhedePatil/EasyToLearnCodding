import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-angular-demo',
  templateUrl: './angular-demo.component.html',
  styleUrls: ['./angular-demo.component.css']
})
export class AngularDemoComponent implements OnInit {

  b:any="";
name:string="Rushikesh";
disabledBox=true;
Uname:string="Rushikesh";
enableBox()
{
  this.disabledBox=false;
}
  Fun():any{
  
    return this.b.values;
  }
msg:string="";
  onInputClick(event:any)
  {
    this.msg=event.target.value + " Added To Cart";
  }

  favoriteSeason:string="";
  seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];

  constructor() { }

  ngOnInit(): void {
  }

}
