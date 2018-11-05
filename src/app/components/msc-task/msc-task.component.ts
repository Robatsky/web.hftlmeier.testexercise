import { Component, OnInit, OnDestroy } from '@angular/core';
import * as mermaidAPI from "mermaid";
import { log } from 'util';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';

declare var require: any;



class Subject {
  id: number;
  name: string;
  checked: boolean;
  constructor(id: number, name: string, checked: boolean) {
    this.id = id;
    this.name = name;
    this.checked = checked;
  }
  isInSubjects(subjects: Subject[]): boolean {
    for (var z = 0; z < subjects.length; z++) {
      if (subjects[z].name == this.name) {
        return true;
      }
    }
    return false;
  }
}

class Participant {
  id: number;
  name: string;
  subjects: Subject[] = [];
  constructor(id: number, name: string, subjects: Subject[]) {
    this.id = id;
    this.name = name;
    this.subjects = subjects;
  };
  hasSubject(s: Subject): boolean {
    for (let i = 0; i < this.subjects.length; i++) {
      if (s.name == this.subjects[i].name) {
        return true;
      }
    }
    return false;
  }
};

class Action {
  id: number;
  public name: string;
  subject: Subject;
  participant: Participant;
  targetParticipant: Participant;
}

class LocalAction {
  id: number;
  name: string;
  subject: Subject;
  participant: Participant;
  secKey: Subject;
  result: Subject;
}

class Goal {
  //goodGoal: boolean;
  resultType: ResultType;
  points: number;
  processed: boolean;
  finished: boolean;
  actionId: number;
  argument1: any;
  argument2: any;
  argument3: any;
  argument4: any;
  msgText: string;
  durable: boolean;

  constructor(resultType: ResultType, points: number, finished: boolean, durable: boolean, actionId: number, arg1: any, arg2: any, arg3: any, arg4: any, msg: string) {
    //this.goodGoal = goodGoal;
    this.resultType = resultType;
    this.points = points;
    this.processed = false;
    this.finished = finished;
    this.actionId = actionId;
    this.argument1 = arg1;
    this.argument2 = arg2;
    this.argument3 = arg3;
    this.argument4 = arg4;
    this.msgText = msg;
    this.durable = durable;
  }
}

enum ResultType {
  good,
  wrong,
  info,
}

class AnswerType {
  constructor(public id: number, public result: ResultType, public message: string) {
  }
}

class QuestionType {
  constructor(public id: number, public name: string) {
  }
}


class LocalVars {
  reactor: any;
  answerSet_1: AnswerType[];
  answerStepIdx: number;
  goodPoints: number;
  failPoints: number;

  constructor(reactor, answerSet_1, answerStepIdx, goodPoints, failPoints) {
    this.answerSet_1 = answerSet_1;
    this.answerStepIdx = answerStepIdx;
    this.goodPoints = goodPoints;
    this.failPoints = failPoints;
  }
}
class StatusResult {
  state: number = 0; // 0 = empty; 1 = ok; 2 = err
  msg: string = "";

  /*  constructor() {
      this.msg = "";
      this.state = 0;
    }*/

  constructor(m?: string, s?: number) {
    this.msg = m;
    this.state = s;
  }
}

class TaskResult {
  maxPoints: number = 0;
  minPoints: number = 0;
  resultPoints: number = 0;
  firstResultPoints: number = 0;
  firstResultSet: boolean = false;

  constructor(public max: number, public min: number, result: number, firstResult: number, firstSet: boolean) {
    this.maxPoints = max;
    this.minPoints = min;
    this.resultPoints = result;
    this.firstResultPoints = firstResult;
    this.firstResultSet = firstSet;
  }
}

class TaskEntry {
  constructor(public title: string, public enabled: boolean, public url: string, public component, public taskService, public result: TaskResult) {
  }
}


@Component({
  selector: 'app-msc-task',
  templateUrl: './msc-task.component.html',
  styleUrls: ['./msc-task.component.css']
})
export class MscTaskComponent implements OnInit, OnDestroy {
  resultType = ResultType;

  taskIdx: number;

  public reactor: any;
  public stepReadyButtonDisabled: boolean = true;
  public finishButtonDisabled: boolean = false;
  public showFinishButton: boolean = true;
  public showNextButton: boolean = false;

  public answerSteps = [];
  public allRuleFacts = [];

  public actionAnswerOptions = [
    { id: 0, name: "fragt" },
    { id: 1, name: "sendet" },
    { id: 2, name: "verschlüsselt" },
    { id: 3, name: "entschlüsselt" },
    { id: 4, name: "signiert" },
    { id: 5, name: "verifiziert" },
    { id: 6, name: "berechnet" },
    { id: 7, name: "vergleicht" },
    { id: 8, name: "besitzt" }
  ];

  public ruleSubjects: Subject[] = [];
  public wildcardSubject: Subject = new Subject(100, "*", false);

  public ruleParticipants: Participant[] = [];
  public wildcardParticipant: Participant = new Participant(3, "*", []);

  public goalFacts: Goal[] = [];
  public assertedFacts: any = [];

  public selectedAction: any = {};
  public selectedParticipantSource: Participant = new Participant(-1, "", []);

  public selectedParticipantTarget: Participant = new Participant(-1, "", []);
  public selectedSubject: Subject = new Subject(-1, "", false);
  public selectedUsingSubject: Subject = new Subject(-1, "", false);
  public selectedResultSubject: Subject = new Subject(-1, "", false);
  mermaidRenderCnt: number = 0;
  mscSvgCode = '';

  public answerSet_1: AnswerType[] = [];
  public answerStepIdx: number = 1;
  public mscText: string;

  goodPoints: number = 0;
  failPoints: number = 0;

  taskResult: TaskResult;
  statusResult: StatusResult = new StatusResult();

  private subscription: any;

  public localVars: LocalVars;

  constructor(private route: ActivatedRoute,
    private router: Router,
    protected taskService: TaskService) {
    this.taskIdx = route.snapshot.data[0].idx;
    console.log("Name:" + this.selectedParticipantSource.name);

  };

  public ngOnInit() {
    // initialize mermaid API for MSC charts
    mermaidAPI.initialize({
      startOnLoad: true,
      flowchart: {
        htmlLabels: false
      },
      sequence: {
        mirrorActors: false,
        actorMargin: 400,
        height: 35,
        topPadding: 125,
        useMaxWidth: true
      }
    });

    //get the rule reactor instance from a service, i.e. always get the sane rule reactor instance (singleton)
    var RuleReactor = require("rule-reactor");
    this.reactor = new RuleReactor();



    this.initializeFacts();
    this.initializeMsc();
    this.initializeReactorRules();
    this.startReactor();
  }

  public ngOnDestroy() {
    this.reactor.stop();

    this.ruleParticipants.forEach((p) => {
      this.reactor.retract(p)
    });

    this.goalFacts.forEach((goal) => {
      this.reactor.retract(goal)
    });

    this.assertedFacts.forEach((fact) => {
      this.reactor.retract(fact)
    });

    this.allRuleFacts.forEach((fact) => {
      this.reactor.retract(fact)
    });

    this.allRuleFacts = [];

    this.reactor.retract(this.localVars);

    this.reactor.reset();
  }


  clearTask() {

    // stop and reset the rule reactor
    this.reactor.stop();

    this.ruleParticipants.forEach((p) => {
      this.reactor.retract(p)
    });

    this.goalFacts.forEach((goal) => {
      this.reactor.retract(goal)
    });

    this.assertedFacts.forEach((fact) => {
      this.reactor.retract(fact)
    });

    this.allRuleFacts.forEach((fact) => {
      this.reactor.retract(fact)
    });
    this.allRuleFacts = [];

    this.reactor.retract(this.localVars);



    // change the layout, i.e. present the input elements
    this.stepReadyButtonDisabled = true;
    this.finishButtonDisabled = false;
    this.showFinishButton = true;
    this.showNextButton = false;

    // reset all result data structure etc.
    this.initializeResults();
    // reset/initialize al Rule facts
    this.initializeFacts();
    // initialize an empty Msc
    this.initializeMsc();
    // start the rule reactor
    this.startReactor();

    // store result, i.e. delete any old results from storage
    this.saveResults();
  }


  initializeResults() {
    this.answerStepIdx = 1;
    this.answerSet_1 = [];

    this.goodPoints = 0;
    this.failPoints = 0;
    this.mscText = "";
  }

  initializeFacts() {


    this.assertedFacts = [];
    this.allRuleFacts = [];

    this.answerSteps = [];

    this.localVars = new LocalVars(this.reactor, this.answerSet_1, this.answerStepIdx, this.goodPoints, this.failPoints);

    this.ruleSubjects = [
      new Subject(0, "Message Text", false),
      new Subject(1, "Encrypted Message Text", false),
      new Subject(2, "private key (Alice)", false),
      new Subject(3, "public key (Alice)", false),
      new Subject(4, "private key (MitM)", false),
      new Subject(5, "public key (MitM)", false),
      new Subject(6, "private key (Bob)", false),
      new Subject(7, "public key (Bob)", false),
      new Subject(8, "message signature", false)
    ];

    this.ruleParticipants = [
      new Participant(0, "Alice", [this.ruleSubjects[0],
      this.ruleSubjects[2],
      this.ruleSubjects[3]]),
      new Participant(1, "MitM", [this.ruleSubjects[4],
      this.ruleSubjects[5]]),
      new Participant(2, "Bob", [this.ruleSubjects[6],
      this.ruleSubjects[7]])
    ];


    /* Goal:
       (resultType: ResultType, points: number, finished: boolean, durable: boolean, actionId: number, arg1: any, arg2:any, arg3:any, arg4:any, msg:string)
     */
    this.goalFacts = [

      // Bob (id=2) has (id=8) message text (id=0)
      new Goal(ResultType.info, 0, true, true, 8, this.ruleParticipants[2], this.ruleSubjects[0], null, null,
        "Aufgabe beendet: " + this.ruleParticipants[2].name + " has " + this.ruleSubjects[0].name),

      // Alice (id=0) sends (id=1) encrypted message (id=1) to MitM (id=1)
      new Goal(ResultType.good, 1, false, true, 1, this.ruleParticipants[0], this.ruleParticipants[1], this.ruleSubjects[1], null,
        "Korrekt : " + this.ruleParticipants[0].name + " sends to  " + this.ruleParticipants[1].name + " : " + this.ruleSubjects[1].name),

      // Bob (id=2) sends (id=1) his own public key (7) to MitM (id=1)
      new Goal(ResultType.good, 1, false, true, 1, this.ruleParticipants[2], this.ruleParticipants[1], this.ruleSubjects[7], null,
        "Korrekt: " + this.ruleParticipants[2].name + " sends to  " + this.ruleParticipants[1].name + " : " + this.ruleSubjects[7].name),

      // MitM (id=1) sends (id=1) his own public (id=5) key to Alice (id=0)
      new Goal(ResultType.good, 1, false, true, 1, this.ruleParticipants[1], this.ruleParticipants[0], this.ruleSubjects[5], null,
        "Korrekt: " + this.ruleParticipants[1].name + " sends to  " + this.ruleParticipants[0].name + " : " + this.ruleSubjects[5].name),

      // Alice (id=0) encrypts (id=2) message text (id=0)
      new Goal(ResultType.good, 1, false, true, 2, this.ruleParticipants[0], this.ruleSubjects[0], this.ruleSubjects[5], this.ruleSubjects[1],
        "Korrekt: " + this.ruleParticipants[0].name + " encrypts " + this.ruleSubjects[0].name),

      // MitM (id=1) decrypts (id=3) encrypted message text (id=1)
      new Goal(ResultType.good, 1, false, true, 3, this.ruleParticipants[1], this.ruleSubjects[1], this.ruleSubjects[4], this.ruleSubjects[0],
        "Korrekt: " + this.ruleParticipants[1].name + " decrypts " + this.ruleSubjects[1].name),

      // MitM (id=1) encrypts (id=2) message text (id=0)
      new Goal(ResultType.good, 1, false, true, 2, this.ruleParticipants[1], this.ruleSubjects[0], this.ruleSubjects[7], this.ruleSubjects[1],
        "Korrekt: " + this.ruleParticipants[1].name + " encrypts " + this.ruleSubjects[0].name),

      // Bob (id=2) decrypts (id=3) encrypted message text (id=1)
      new Goal(ResultType.good, 1, false, true, 3, this.ruleParticipants[2], this.ruleSubjects[1], this.ruleSubjects[6], this.ruleSubjects[0],
        "Korrekt: " + this.ruleParticipants[2].name + " decrypts " + this.ruleSubjects[1].name),


      // Alice (id=0) must not encrypt (id=2) something using her own public key (id=3)
      new Goal(ResultType.wrong, -1, false, false, 2, this.ruleParticipants[0], this.ruleSubjects[0], this.ruleSubjects[3], this.ruleSubjects[1],
        "Fehler: " + this.ruleParticipants[0].name + " encrypts " + this.ruleSubjects[0].name + "macht keinen Sinn, denn dies könnte nur Alice entschlüsseln!"),

      // Alice (id=0) must not send (id=1) her private key (id=2)
      new Goal(ResultType.wrong, -1, false, true, 1, this.ruleParticipants[0], this.wildcardParticipant, this.ruleSubjects[2], null,
        "Grober Fehler: " + this.ruleParticipants[0].name + " darf " + this.ruleSubjects[2].name + " nie versenden!!!"),

      // Alice (id=0) must not send (id=1) the (unencrypted) message text (id=0)
      new Goal(ResultType.wrong, -1, false, true, 1, this.ruleParticipants[0], this.wildcardParticipant, this.ruleSubjects[0], null,
        "Fehler: Es verstößt gegen die Aufgabenstellung wenn " + this.ruleParticipants[0].name + " den " + this.ruleSubjects[0].name + " versendet!"),

      // MitM (id=1) must not send (id=1) his private key (id=4)
      new Goal(ResultType.wrong, -1, false, true, 1, this.ruleParticipants[1], this.wildcardParticipant, this.ruleSubjects[4], null,
        "Grober Fehler: " + this.ruleParticipants[1].name + " darf " + this.ruleSubjects[4].name + " nie versenden!!!"),

      // MitM (id=1) must not send (id=1) the (unencrypted) message text (id=0)
      new Goal(ResultType.wrong, -1, false, true, 1, this.ruleParticipants[1], this.wildcardParticipant, this.ruleSubjects[0], null,
        "Fehler: Es verstößt gegen die Aufgabenstellung wenn " + this.ruleParticipants[1].name + " den " + this.ruleSubjects[0].name + " versendet!"),

      // Bob (id=2) must not send (id=1) his private key (id=6)
      new Goal(ResultType.wrong, -1, false, true, 1, this.ruleParticipants[2], this.wildcardParticipant, this.ruleSubjects[6], null,
        "Grober Fehler: " + this.ruleParticipants[2].name + " darf " + this.ruleSubjects[6].name + " nie versenden!!!"),
    ];
  }

  initializeMsc() {
    this.mermaidRenderCnt++;
    var mscText = 'sequenceDiagram\n ';

    for (let i = 0; i < this.ruleParticipants.length; i++) {
      mscText = mscText + '    participant ' + this.ruleParticipants[i].name + ' \n ';
    }

    var graph = mermaidAPI.render('graphDiv' + this.mermaidRenderCnt, mscText, svgCode => { this.mscSvgCode = svgCode }
    );
  };

  initializeReactorRules() {

    // low priority action rule, .i.e. the action should be retracted here
    this.reactor.createRule("action-rule", 0, { action: Action, localVars: LocalVars },
      (action) => {
        return true;
      },
      (action, localVars) => {
        console.log("Action Rule fired for : " + action.name);
        if (action.id === 1) {
          if (action.participant.id === 0 && action.targetParticipant.id === 2) {
            console.log("-----> Message goes to " + this.ruleParticipants[1].name)
          }
          if (!this.ruleParticipants[1].hasSubject(action.subject)) {
            this.ruleParticipants[1].subjects.push(action.subject)
          }
          if (!action.targetParticipant.hasSubject(action.subject)) {
            action.targetParticipant.subjects.push(action.subject);
          }
          localVars.reactor.retract(action);
        }
      });

    // low priority loca-action rule, .i.e. the local-action should be retracted here
    this.reactor.createRule("local-action-rule", 0, { localAction: LocalAction },
      function (localAction) {
        return true;
      },
      function (localAction) {
        console.log("LocalAction Rule fired for : " + localAction.name);
        if (!localAction.participant.hasSubject(localAction.result)) {
          localAction.participant.subjects.push(localAction.result);
        }
      });

    this.reactor.createRule("goal-hasSubject", 0, { goal: Goal, p: Participant, localVars: LocalVars },
      function (goal, p) {
        if (goal.actionId === 8
          && goal.argument1 && goal.argument1.name == p.name
          && goal.argument2 && (goal.argument2.isInSubjects(p.subjects) == true)) {
          return true;
        } else {
          return false;
        }
      },
      (goal, localVars) => {
        console.warn(goal.msgText);
        if (!goal.processed) {
          goal.processed = true;
          localVars.goodPoints += goal.points;
        }
        localVars.answerSet_1.push(new AnswerType(localVars.answerStepIdx, goal.resultType, "[Schritt " + localVars.answerStepIdx + "] " + goal.msgText));
        localVars.answerStepIdx++;
        var finished = goal.finished;

        if (!goal.durable) {
          localVars.reactor.retract(goal);
        }

        if (finished) {
          this.taskFinished();
        }
      }
    );

    // high priority action rule, .i.e. the action must not be retracted here !!!
    this.reactor.createRule("goal-action", 10, { goal: Goal, action: Action, localVars: LocalVars },
      (goal, action) => {
        if (goal.actionId == action.id &&
          goal.argument1 && goal.argument1.name == action.participant.name &&
          goal.argument2 && (goal.argument2.name == action.targetParticipant.name ||
            goal.argument2.name == this.wildcardParticipant.name) &&
          goal.argument3 && goal.argument3.name == action.subject.name) {
          return true;
        } else {
          return false;
        }
      },
      (goal, action, localVars) => {
        console.warn(goal.msgText);
        if (!goal.processed) {
          goal.processed = true;
          localVars.goodPoints += goal.points;
        }
        localVars.answerSet_1.push(new AnswerType(localVars.answerStepIdx, goal.resultType, "[Schritt " + localVars.answerStepIdx + "] " + goal.msgText));
        localVars.answerStepIdx++;

        if (!goal.durable) {
          localVars.reactor.retract(goal);
        }
      }
    );

    // high priority local-action rule, .i.e. the localaction must not be retracted here!!!
    this.reactor.createRule("goal-local-action", 10, { goal: Goal, action: LocalAction, localVars: LocalVars },
      (goal, action) => {
        if (goal.actionId == action.id &&
          goal.argument1 && goal.argument1.name == action.participant.name &&
          goal.argument2 && goal.argument2.name == action.subject.name &&
          goal.argument3 && goal.argument3.name == action.secKey.name &&
          goal.argument4 && goal.argument4.name == action.result.name) {
          return true;
        } else {
          return false;
        }
      },
      (goal, localVars) => {
        console.warn(goal.msgText);
        if (!goal.processed) {
          goal.processed = true;
          localVars.goodPoints += goal.points;
        }
        localVars.answerSet_1.push(new AnswerType(localVars.answerStepIdx, goal.resultType, "[Schritt " + localVars.answerStepIdx + "] " + goal.msgText));
        localVars.answerStepIdx++;
        if (!goal.durable) {
          localVars.reactor.retract(goal);
        }
      }
    );

    /*    this.reactor.createRule("stop", -100, {},
          function() { return true; },
          function() { this.reactor.stop(); }
        );*/
  }

  private assertAndSaveFact(fact: any) {
    this.reactor.assert(fact);
    this.assertedFacts.push(fact);
  }

  startReactor() {
    this.reactor.trace(1);

    this.ruleParticipants.forEach((p) => {
      this.reactor.assert(p)
    });

    this.goalFacts.forEach((goal) => {
      this.reactor.assert(goal)
    });

    this.reactor.assert(this.localVars);


    this.reactor.run(Infinity, false, function () {
      console.log("Reactor finished");
    });
  }

  targetParticipantSelected() {
    console.log("target participant selected");
    this.stepReadyButtonDisabled = false;
  }

  finalSubjectSelected() {
    console.log("Subject selected: ");
    this.stepReadyButtonDisabled = false;
  }

  toggleSubjectSelection(subject) {
    console.log("subject selection changed: " + subject.subject);
  }

  c() {
    console.log("changed");
    console.log(this.selectedParticipantSource.name);

  }
  stepReady() {
    var ruleActionSteps: any = [];
    this.stepReadyButtonDisabled = true;
    this.mermaidRenderCnt++;
    let answer: any = {};

    // construct ruleAction array, i.e. contains all facts for the rule engine
    // AND
    // construct answerSteps array, i.e. contains all entries for drawing the MSC
    // Request or Message Action
    switch (this.selectedAction.id) {
      case 0:
      case 1: {
        answer.action = this.selectedAction;
        answer.participantSource = this.selectedParticipantSource;
        // the communication always goes to MiTM
        if (answer.participantSource != this.ruleParticipants[1]) {
          answer.participantTarget = this.ruleParticipants[1]; // this.selectedParticipantTarget;
        } else {
          answer.participantTarget = this.selectedParticipantTarget;
        }

        answer.subjects = [];

        // action: sends: id=1
        if (answer.action.id === 1) {
          for (let i = 0; i < answer.participantSource.subjects.length; i++) {
            if (answer.participantSource.subjects[i].checked) {
              // reset checked flag
              answer.participantSource.subjects[i].checked = false;
              // add subject to answer for later drawing
              answer.subjects.push(answer.participantSource.subjects[i]);
              // create an Action for each subject that was ask for
              let ruleAction: Action = new Action();
              ruleAction.id = answer.action.id;
              ruleAction.name = answer.action.name;
              ruleAction.participant = answer.participantSource;
              ruleAction.targetParticipant = answer.participantTarget;
              ruleAction.subject = answer.participantSource.subjects[i];
              ruleActionSteps.push(ruleAction);
              this.allRuleFacts.push(ruleAction);
            }
          }
        } else if (answer.action.id === 0) {
          // we use the original this.selectedParticipantTarget instead of answer.participantTarget
          // because the answer target might have been changed due to MitM interruption
          for (let i = 0; i < this.selectedParticipantTarget.subjects.length; i++) {
            if (this.selectedParticipantTarget.subjects[i].checked) {
              // reset checked flag
              this.selectedParticipantTarget.subjects[i].checked = false;
              // add subject to answer for later drawing
              answer.subjects.push(this.selectedParticipantTarget.subjects[i]);
              // create an Action for each subject that was ask for
              let ruleAction: Action = new Action();
              ruleAction.id = answer.action.id;
              ruleAction.name = answer.action.name;
              ruleAction.participant = answer.participantSource;
              ruleAction.targetParticipant = answer.participantTarget;
              ruleAction.subject = this.selectedParticipantTarget.subjects[i];
              ruleActionSteps.push(ruleAction);
              this.allRuleFacts.push(ruleAction);
            }
          }
        }

        // save this answer (for later verification and drawing...)
        this.answerSteps.push(answer);
        break;
      }
      case 2:
      case 3: {
        answer.action = this.selectedAction;
        answer.participantSource = this.selectedParticipantSource;
        answer.subject = this.selectedSubject;
        answer.secKey = this.selectedUsingSubject;
        answer.result = this.selectedResultSubject;

        let ruleAction: LocalAction = new LocalAction();
        ruleAction.id = answer.action.id;
        ruleAction.name = this.selectedAction.name;
        ruleAction.participant = this.selectedParticipantSource;
        ruleAction.subject = this.selectedSubject;
        ruleAction.secKey = this.selectedUsingSubject;
        ruleAction.result = this.selectedResultSubject;
        ruleActionSteps.push(ruleAction);
        this.allRuleFacts.push(ruleAction);

        // save this answer (for later verification and drawing...)
        this.answerSteps.push(answer);
        break;
      }
      default: {
        console.warn("Action not supported... (" + this.selectedAction.name + ")");
      }
    }

    // reset selected action values
    this.selectedAction = {};
    this.selectedParticipantSource = new Participant(-1, "", []);
    this.selectedParticipantTarget = new Participant(-1, "", []);
    this.selectedSubject = new Subject(-1, "", false);
    this.selectedUsingSubject = new Subject(-1, "", false);
    this.selectedResultSubject = new Subject(-1, "", false);

    this.drawAnswerStepsMSC();

    this.evaluateRuleActionSteps(ruleActionSteps);

  }

  private drawAnswerStepsMSC() {
    //draw new diagram
    var mscText = 'sequenceDiagram\n ';
    for (let i = 0; i < this.ruleParticipants.length; i++) {
      mscText = mscText + '    participant ' + this.ruleParticipants[i].name + '\n ';
    }
    // mscText = mscText + '    participant Schnulli \n ';
    for (let i = 0; i < this.answerSteps.length; i++) {
      let answer = this.answerSteps[i];
      switch (answer.action.id) {
        case 0:
        case 1: {
          let allSubjects = '';
          for (let j = 0; j < answer.subjects.length; j++) {
            allSubjects = allSubjects + answer.subjects[j].name;
            if (j == (answer.subjects.length - 2)) {
              allSubjects = allSubjects + " and ";
            } else if (j < (answer.subjects.length - 2)) {
              allSubjects = allSubjects + " , ";
            }
          }
          if (answer.action.id === 0) {
            mscText = mscText + answer.participantSource.name + '->>' +
              answer.participantTarget.name + ': Get ' + allSubjects + ' \n ';
          } else if (answer.action.id === 1) {
            mscText = mscText + answer.participantSource.name + '->>' +
              answer.participantTarget.name + ': ' + allSubjects + ' \n ';
          }

          break;
        }
        case 2:
        case 3: {
          var notePos = "over";
          if (answer.participantSource.id === 0) {
            notePos = "left of";
          } else if (answer.participantSource.id === 2) {
            notePos = "right of";
          }

          mscText = mscText + 'Note ' + notePos + ' ' + answer.participantSource.name + ':' +
            answer.action.name + ' ' + answer.subject.name + ' unter Benutzung des ' + answer.secKey.name +
            '. Das Ergebnis ist: ' + answer.result.name + ' \n ';
          break;
        }
        default: {

        }
      }
    }
    /*    mscText ='sequenceDiagram \n ' +
     ' participant Alice\n ' +
     ' participant Bob\n ' +
     ' participant Schnulli\n ' +
     ' Alice->>Bob: Test';*/
    var graph = mermaidAPI.render('graphDiv' + this.mermaidRenderCnt, mscText, svgCode => { this.mscSvgCode = svgCode }
    );
    this.mscText = mscText;
  }

  private evaluateRuleActionSteps(ruleActionSteps: any[]) {
    for (let j = 0; j < ruleActionSteps.length; j++) {
      this.assertAndSaveFact(ruleActionSteps[j]);
    }
  }

  gotoNextTask() {
    //
    // enable next subtask
    // navigate to next subtask
  }

  taskFinished() {

    this.reactor.stop();

    this.ruleParticipants.forEach((p) => {
      this.reactor.retract(p)
    });

    this.goalFacts.forEach((goal) => {
      this.reactor.retract(goal)
    });

    this.assertedFacts.forEach((fact) => {
      this.reactor.retract(fact)
    });

    this.allRuleFacts.forEach((fact) => {
      this.reactor.retract(fact)
    });

    this.allRuleFacts = [];

    this.answerSet_1 = this.localVars.answerSet_1;
    this.goodPoints = this.localVars.goodPoints;
    this.failPoints = this.localVars.failPoints;

    this.reactor.retract(this.localVars);

    this.reactor.reset();


    var pts = this.goodPoints - this.failPoints;

    this.saveResults();


    var pass: boolean = true;
    if (pass === true) {
      this.setTaskResult(pts);

      this.showFinishButton = false;
      this.showNextButton = true;
    } else {
      this.finishButtonDisabled = true;
    }

  }

  private setTaskResult(pts: number) {
  }


  private saveResults() {
    var resultToSave: any = {};
    resultToSave.mscText = this.mscText;
    resultToSave.answerSet = this.answerSet_1;
  }
}
