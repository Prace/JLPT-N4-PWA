import { ApplicationRef, Component, OnDestroy, OnInit } from '@angular/core';
import {IChoice, Word, words} from './words/words';
import { interval } from 'rxjs';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  public words: Array<Word>;
  public otherMeanings: Array<string>;
  public wordNumber: number;
  public currentWord: Word;
  public currentMeanings: Array<IChoice>;
  public showSolution = false;
  public correctAnswersCounter = 0;
  public wrongAnswersCounter = 0;
  public answerTime = 5000;
  public remainingTimeMs = 5000;
  private timerSubscription: any;
  public deferredPrompt: any;

  constructor(private applicationRef: ApplicationRef) {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
    });
  }


  ngOnInit() {
    this.words = words;
    this.otherMeanings = words.map(a => a.translation);
    this.wordNumber = this.otherMeanings.length;
    this.nextWord();
  }

  ngOnDestroy() {
    this.timerSubscription.unsubscribe();
  }

  private getRandomInt(min: number , max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  private getMeanings(correctValue: string): Array<IChoice> {
    let i: number;
    let ret: Array<IChoice> = [];

    for (i = 0; i < 3; i++) {
      var value = this.otherMeanings[this.getRandomInt(0, this.wordNumber)];
      if (value !== correctValue) {
        ret.push({value: value, correct: false});
      }
    }
    ret.push({value: correctValue, correct: true});
    return ret;
  }

  private shuffleInPlace<T>(array: T[]): T[] {
    if (array.length <= 1) { return array; }
    for (let i = 0; i < array.length; i++) {
      const randomChoiceIndex = this.getRandomInt(0, array.length);
      [array[i], array[randomChoiceIndex]] = [array[randomChoiceIndex], array[i]];
    }
    return array;
  }

  public nextWord() {
    this.currentWord = this.words[this.getRandomInt(0, this.wordNumber)];
    this.currentMeanings = this.shuffleInPlace(this.getMeanings(this.currentWord.translation));
  }

  public revealSolution(correctAnswer: boolean): void {
    this.remainingTimeMs = this.answerTime;
    if (this.showSolution) {
      this.showSolution = false;
      this.nextWord();
    } else {
      this.showSolution = true;
      correctAnswer ? this.correctAnswersCounter++ : this.wrongAnswersCounter++;
    }
  }

  public setSolutionColor(correct: boolean): string {
    if (this.showSolution) {
      return correct ? 'green' : 'red';
    }
  }

  public openA2HSDialog(e){
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        this.deferredPrompt = null;
      });
  }
}
