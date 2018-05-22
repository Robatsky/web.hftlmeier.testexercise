import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DnDtaskComponent } from './components/dnd-task/dnd-task.component';
import { NamingTaskComponent } from './components/naming-task/naming-task.component';
import { OverviewComponent } from './components/overview/overview.component';
import { MarkCodeLineComponent } from './components/mark-code-line/mark-code-line.component';
import { OrderDefinitionHeadingsTaskComponent } from './components/order-definition-headings-task/order-definition-headings-task.component';
import { TaskService } from './services/task.service';

// possible? best practise? 
declare var require: any;
let routes: Routes = [
    {
        path: '',
        component: OverviewComponent,
        data: [{ id: -1, name: "json.name", description: "json.description", taskamount: 0 }]
    }];
routes = loadRouteComponents(false);
/**
 * Loades the json file and converts the tasks into 
 * route objects. 
 * 
 * @return an array containing the route objects
 */
function loadRouteComponents(justLoad: boolean): Routes {

    if (justLoad) {
        return routes;
    }

    // load the appropriate json file
    let json = require('../assets/tasks.json');
    let loadedRoutes = [];

    // push overview route separatly because it does not have the typicall task structure
    loadedRoutes.push({
        path: '',
        component: OverviewComponent,
        data: [{ id: -1, name: json.name, description: json.description, taskamount: json.tasks.length }]
    });


    // for each task in the json array
    //for (let task of json.tasks) {
    json.tasks.forEach(task => {
        let route = convertTaskToRoute(task);
        loadedRoutes.push(route);
    });

    return loadedRoutes;
}

/**
 * Takes a task as an json object and converts it into a corresponding
 * route object. Each route has the following syntax:
 * {@code {path: path, component: component, data: [{id: id, name: name, data: data}]}}
 * 
 * @param task the task json object to be converted
 * @return the converted route object
 */
function convertTaskToRoute(task) {

    // NOTE: You need to add the path as well as the corresponding module
    // in order to add a new task
    const map = [
        ["dnd", DnDtaskComponent],
        ["naming", NamingTaskComponent],
        ["markcodeline", MarkCodeLineComponent],
        ["orderdefhead", OrderDefinitionHeadingsTaskComponent]
    ];

    let mapper = map[task.type];

    let path = mapper[0] + task.id;
    let comp = mapper[1];
    return {
        path: path,
        component: comp,
        data: [
            {
                id: task.id,
                name: task.name,
                question: task.question,
                reqpoints: task.reqpoints,
                maxpoints: task.maxpoints,
                data: task.data
            }
        ]
    };
}

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
@Component({
    selector: 'nav-entries',
    template: `
    <ul class='nav navbar-nav mr auto'>
        <li class="nav-item"><a class="nav-link" routerLink='/' >Overview</a></li>
        <li class="nav-item " *ngFor="let ne of entries">
            <a class="nav-link" routerLink='/{{ne.path}}' [class.disabled]="!ne.active">{{ne.name}}</a>
        </li>
    </ul>
    `
})
export class AppRoutingModule {
    public entries = [];

    constructor(taskService: TaskService) {
        // generates the navbar entries out of the json file
        loadRouteComponents(true).forEach(e => {
            this.entries.push({ path: e.path, name: e.data[0].name, active: false});
        });
        // first item is not necessary because it is hardcoded as the overview tab
        this.entries.shift();
        taskService.setNavbarEntries(this.entries);
    }
}


