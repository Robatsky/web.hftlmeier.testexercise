import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, Route } from '@angular/router';
import {Constants} from '../../model/Constants';
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
})
export class NavigationComponent implements OnInit {

  private navEntries : any[];
  private tasks : string[];

  constructor(private router:Router, 
              private httpService: HttpClient) {
    
    let routes: Route[] = this.router.config;
    let newRoutes: Route[] = [];

    this.navEntries = this.router.config.map(e => e.path);

    this.httpService.get('./assets/task.json').forEach(e => {
      let data = e as string[];
     
      for(let i = 0; i < data.length; i++) {
        routes[i].data[0].model = {
          idx: data[i]['id'],
          type: Constants.get(data[i]['type']),
          name: data[i]['name'],
          data: {
            maxpoints: data[i]['data']['maxpoints'],
            requiredPoints: data[i]['data']['reqpoints'],
            answers: data[i]['data']['answers']
          }
        };
        
        newRoutes.push(routes[i])
        this.navEntries[i] = {
          path:newRoutes[i].path, 
          name:newRoutes[i].data[0].model.name
        }; 
        this.router.config.push(newRoutes[i]);
      }
    }); 
  }

  ngOnInit(): void {
  }

}
