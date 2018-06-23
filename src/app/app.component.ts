import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  exerciseTable: IExercise[] = [];

  newExerciseModel: IExercise = {} as IExercise;

  constructor() {

  }

  ngOnInit(): void {
    this.resetModel();
    const ex: IExercise = {
      name: 'Ćwiczenie 1',
      repCount: 10,
      repDuration: 120
    }

    this.exerciseTable.push(ex);
  }

  addExercise() {
    console.log('add');
    this.exerciseTable.push(this.newExerciseModel);
    this.resetModel();
  }

  resetModel() {
    this.newExerciseModel = {
      name: '',
      repCount: 20,
      repDuration: 0
    }
  }

}

export interface IExercise {
  name: string,
  repCount: number,
  repDuration: number, //in seconds
}