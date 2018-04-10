import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-namingtask',
  templateUrl: './namingtask.component.html',
})
export class NamingtaskComponent implements OnInit {

  private model : NamingtaskModel;
  private userInputs = [{value: ''}];
  private hints = [];

  constructor(private route: ActivatedRoute) {
    this.model = this.route.snapshot.data[0].model;
  }

  ngOnInit() : void{
  }

  addInputField() {
    this.userInputs.push({value:''});
  }

  /**
   * Evaluates the inputs from the user.
   */
  evalInputs() {
    this.hints = [];
    if(this.hasEmptyInputs()) {
       this.hints.push("Es darf kein Element leer sein!");
       return;
    }

    let points = 0;
    this.userInputs.forEach(val => {
        if(this.arrayContains(this.model.data.answers, val.value)) {
            this.hints.push("Richtig! " + val.value + " ist ein wichtiger Bestandteil");
        } else {
          this.hints.push("Falsch! " + val.value + " ist kein Bestandteil!");
        }
    });
  }

  /**
   * Checks whether the {@link userInputs} array has empty fields.
   * An element is considered to be empty if its content length is zero.
   * @return {@code true} if the array has at least one empty element, {@code false otherwise}
   */
  private hasEmptyInputs() : boolean {
    return this.userInputs.map(e => e.value).filter(e => e.length == 0).length != 0;
  }

  /**
   * Checks whether the given {@code arr} has the element {@code val} in its collection.
   * @param arr the collection to be checked
   * @param val the value to be checked whether it its in the collection or not
   * @return {@code true} if the collection has at least one element equal to {@code val}, {@code false} otherwise.
   */
  private arrayContains<T>(arr : T[], val : T) : boolean {
     return arr.indexOf(val) != -1;
  }

}

interface NamingtaskModel {
  idx: number,
  type: string,
  name: string,
  data: NamingtaskData
}

interface NamingtaskData {
  maxpoints: number,
  requiredPoints: number,
  answers: string[]
}