import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ClientsService } from '../shared/client.service';
import { Client } from '../shared/client.model';

@Component({
  selector: 'app-client-search',
  templateUrl: './client-search.component.html',
  styleUrls: ['./client-search.component.scss']
})
export class ClientSearchComponent implements OnInit {
  
  clientsArr: Observable<any[]>;
  clients$: Client[];
  startAt: BehaviorSubject<string | null> = new BehaviorSubject('');

  constructor(private clientsSvc: ClientsService) {}

  ngOnInit() {
    
    // Get clients from Firebase based on every keystroke
    this.clientsArr = this.clientsSvc
      .getClients(this.startAt);

    var x = this.clientsSvc.getData();
    x.snapshotChanges().subscribe(item => {
      this.clients$ = [];
      item.forEach(element => {
        var y = element.payload.toJSON();
        y["$key"] = element.key;
        this.clients$.push(y as Client);
      });
    });

    
  }

  search(event: any) {
    this.startAt.next(String(event.target.value));
  }

}
