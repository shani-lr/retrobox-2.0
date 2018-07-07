import { Injectable } from '@angular/core';
import { Note } from '../../shared/models/note.model';
import { Result } from '../../shared/models/result.model';

@Injectable()
export class ResultsService {

  calculateVoteResults(notes: Note[]) {
    const flatResults = this.getFlatResults(notes);
    let results = [];

    flatResults.map((currentResult: Result) => {
      const index = this.findItem(results, currentResult);
      let item = currentResult;
      if (index > -1) {
        item = this.getUpdatedItem(currentResult, results[index]);
      }
      results = [...results.slice(0, index - 1), item, ...results.slice(index + 1)];
    });
    return results;
  }

  private getFlatResults(notes: Note[]) {
    return notes.map((note: Note) => {
      return {
        name: note.group || note.text,
        value: note.votingUsers ? note.votingUsers.length : 0
      }});
  }

  private findItem(results: Result[], currentResult: Result): number {
    return results.map(storedResult => storedResult.name).indexOf(currentResult.name)
  }

  private getUpdatedItem(currentResult: Result, storedResult: Result): Result {
    return {
      name: storedResult.name,
      value: storedResult.value + currentResult.value
    };
  }

}
