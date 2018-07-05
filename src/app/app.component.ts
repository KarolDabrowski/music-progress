import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  state: IProgramState = {} as IProgramState;
  timerId: any;
  newExerciseModel = {
    name: '',
    repCount: 1,
    repDuration: 1
  };
  Math: any;

  constructor() {
    this.Math = Math;
  }

  ngOnInit(): void {
    this.resetState();
    this.resetNewExerciseModel();
  }

  resetNewExerciseModel() {
    this.newExerciseModel = {
      name: '',
      repCount: 1,
      repDuration: 1
    };
  }

  addExercise() {
    const repCount = this.newExerciseModel.repCount <= 0 ? 1 : this.newExerciseModel.repCount;
    const repDuration = this.newExerciseModel.repDuration <= 0 ? 1 : this.newExerciseModel.repDuration;
    const name = this.newExerciseModel.name === '' ? 'Nienazwane' : this.newExerciseModel.name;
    const newReps: IRep[] = [] as IRep[];

    for (let index = 0; index < repCount; index++) {
      newReps.push({
        id: index,
        paused: false,
        started: false,
        finished: false,
        duration: repDuration,
        elapsed: 0
      });
    }

    this.state.exerciseMaxIndex++;
    this.state.exercises.push({
      id: this.state.exerciseMaxIndex,
      name: name,
      reps: newReps,
      repDuration: repDuration,
      finished: false,
      selected: false,
      currentRepId: 0,
      paused: false
    });

    this.resetNewExerciseModel();
  }

  startButtonClicked() {
    if (this.state.running) {
      this.state.running = false;
      this.stopClock();
      return;
    }
    this.state.running = true;
    this.startClock();
  }

  pauseButtonClicked() {
    if (!this.state.running) {
      return;
    }
    this.state.running = false;
    this.stopClock();
  }

  selectExercise(exercise: IExercise) {
    if (this.state.running) {
      return;
    }
    const previouslySelected = this.state.selectedExerciseId;

    this.clearSelection();
    if (previouslySelected === exercise.id) {
      return;
    }
    exercise.selected = true;
    this.state.selectedExerciseId = exercise.id;
  }

  actionButtonDisabled(): boolean {
    const exercise = this.getExercise(this.state.selectedExerciseId);

    if (exercise === undefined || exercise.finished) {
      return true;
    }

    return false;
  }

  resetExercise(exercise: IExercise) {
    exercise.finished = false;
    exercise.currentRepId = 0;
    exercise.reps.forEach(element => {
      element.elapsed = 0;
      element.finished = false;
      element.started = false;
    });
  }


  private clearSelection() {
    this.state.selectedExerciseId = -1;
    this.state.exercises.forEach(element => {
      element.selected = false;
    });
  }

  private updateProgress() {
    const exercise = this.getExercise(this.state.selectedExerciseId);

    if (exercise.finished) {
      this.stopClock();
      return;
    }

    const rep = this.getRep(exercise, exercise.currentRepId);
    if (rep.elapsed + 100 >= rep.duration) {
      this.handleEndOfRep(rep);
      this.setNextRep(exercise);
      return;
    }

    rep.started = true;
    rep.elapsed += 100;
  }

  private handleEndOfRep(rep: IRep) {
    this.stopClock();
    rep.elapsed = rep.duration;
    rep.finished = true;
  }

  private setNextRep(currentExercise: IExercise) {
    const nextRep = this.getRep(currentExercise, currentExercise.currentRepId + 1);
    if (nextRep === undefined) {
      this.handleEndOfExercise(currentExercise);
      return;
    }
    currentExercise.currentRepId += 1;
    this.startClock();
  }

  private handleEndOfExercise(exercise: IExercise) {
    this.stopClock();
    exercise.finished = true;
    if (!this.state.autoStartNextExercise) {
      this.state.running = false;
      return;
    }
    this.setNextExercise();
    this.startClock();
  }

  private setNextExercise() {
    const nextExercise = this.getExercise(this.state.selectedExerciseId + 1);
    if (nextExercise === undefined) {
      this.stopClock();
      this.state.running = false;
      return;
    }
    this.state.selectedExerciseId += 1;
  }

  private getExercise(exerciseId: number): IExercise | undefined {
    return this.state.exercises.find(element => element.id === exerciseId);
  }

  private getRep(exercise: IExercise, repId: number): IRep | undefined {
    return exercise.reps.find(element => element.id === repId);
  }

  private startClock() {
    this.timerId = setInterval(() => { this.updateProgress(); }, 100);
  }

  private stopClock() {
    clearInterval(this.timerId);
  }

  // private millisecondsToSeconds(milliseconds: number) {
  //   return Math.round(milliseconds / 1000);
  // }

  private resetState() {
    this.state = {
      running: false,
      selectedExerciseId: -1,
      autoStartNextExercise: false,
      exerciseMaxIndex: 1,
      exercises: [{
        id: 0,
        name: 'Ćwiczenie 01',
        currentRepId: 0,
        repDuration: 3000,
        reps: [{
          id: 0,
          paused: false,
          started: false,
          finished: false,
          duration: 16000,
          elapsed: 0
        },
        {
          id: 1,
          paused: false,
          started: false,
          finished: false,
          duration: 3000,
          elapsed: 0
        },
        {
          id: 2,
          paused: false,
          started: false,
          finished: false,
          duration: 3000,
          elapsed: 0
        },
        {
          id: 3,
          paused: false,
          started: false,
          finished: false,
          duration: 3000,
          elapsed: 0
        }
        ],
        finished: false,
        selected: false,
        paused: false,
      }, {
        id: 1,
        name: 'Ćwiczenie 02',
        currentRepId: 0,
        repDuration: 3000,
        reps: [{
          id: 0,
          paused: false,
          started: false,
          finished: false,
          duration: 3000,
          elapsed: 0
        },
        {
          id: 1,
          paused: false,
          started: false,
          finished: false,
          duration: 3000,
          elapsed: 0
        }
        ],
        finished: false,
        selected: false,
        paused: false,
      }]
    };

  }

}

export interface IProgramState {
  running: boolean;
  selectedExerciseId: number;
  exercises: IExercise[];
  autoStartNextExercise: boolean;
  exerciseMaxIndex: number;
}

export interface IExercise {
  id: number;
  name: string;
  reps: IRep[];
  repDuration: number;
  finished: boolean;
  selected: boolean;
  currentRepId: number;
  paused: boolean;
}

export interface IRep {
  id: number;
  paused: boolean;
  started: boolean;
  finished: boolean;
  duration: number;
  elapsed: number;
}
