import {Component, OnInit} from '@angular/core';
import {IChoice, Word, words} from './words/words';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public words: Array<Word>;
  public otherMeanings: Array<string>;
  public wordNumber: number;
  public currentWord: Word;
  public currentMeanings: Array<IChoice>;
  public showSolution: boolean;

  ngOnInit() {
    this.words = words;
    this.otherMeanings = words.map(a => a.translation);
    this.wordNumber = this.otherMeanings.length;
    this.showSolution = false;
    this.nextWord();
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
    this.showSolution = false;
    this.currentWord = this.words[this.getRandomInt(0, this.wordNumber)];
    this.currentMeanings = this.shuffleInPlace(this.getMeanings(this.currentWord.translation));
  }

  public revealSolution(): void {
    if (this.showSolution) {
      this.nextWord();
    }
    else {
      this.showSolution = true;
    }
  }

  public setSolutionColor(correct: boolean): string {
    if (this.showSolution) {
      return correct ? 'green' : 'red';
    }
  }
}
