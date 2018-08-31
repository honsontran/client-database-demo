import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import { Client } from './client.model';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Injectable()
export class ClientsService {
  
  clientList: AngularFireList<any>;
  selectedClient: Client = new Client();

  constructor(public firebase : AngularFireDatabase ) { }
  
  getData(){
    this.clientList = this.firebase.list('clients');
    return this.clientList;
  }
  
  insertClient(client: Client)
  {
    if (client.resolved == 'No') {
      this.clientList.push({
        name: client.name,
        id: client.id,
        SC: client.SC,
        county: client.county,
        program: client.program,
        status: client.status,
        resolved: client.resolved,
        issue: '',
        desc: ''
      });
    }

    else {
      this.clientList.push({
        name: client.name,
        id: client.id,
        SC: client.SC,
        county: client.county,
        program: client.program,
        status: client.status,
        resolved: client.resolved,
        issue: client.issue,
        desc: client.desc
      });
    }
  }
  
  updateClient(client : Client){

    if (client.resolved == 'No') {
      this.clientList.update(client.$key,
        {
          name: client.name,
          id: client.id,
          SC: client.SC,
          county: client.county,
          program: client.program,
          status: client.status,
          resolved: client.resolved,
          issue: '',
          desc: ''
        }); 
    }

    else {
      this.clientList.update(client.$key,
        {
          name: client.name,
          id: client.id,
          SC: client.SC,
          county: client.county,
          program: client.program,
          status: client.status,
          resolved: client.resolved,
          issue: client.issue,
          desc: client.desc
        });
    }

  }
  
  deleteClient($key : string){
    this.clientList.remove($key);
  }
  
  getClients(start: BehaviorSubject<string>): Observable<any[]> {
    return start.switchMap(startText => {
      const endText = startText + '\uf8ff';
      return this.firebase
        .list('/clients', ref =>
          ref
            .orderByChild('name')
            .limitToFirst(10)
            .startAt(startText)
        )
        .snapshotChanges()
        .debounceTime(100)
        .distinctUntilChanged()
        .map(changes => {
          return changes.map(c => {
            //console.log('key ' + c.payload.key);
            //console.log(c.payload.val());
            return { $key: c.payload.key, ...c.payload.val() };
          });
        });
    });
  }

  getProblems(): Observable<any[]> {
    return this.firebase
      .list('/clients', ref =>
        ref
          .orderByChild('resolved')
          .equalTo('Yes')
      )
      .valueChanges();
  }

  onEdit(client: Client) {
      this.selectedClient = Object.assign({}, client);
  }
   
  onDelete(key: string) {
    if (confirm('Are you sure to delete this record ?') == true) {
      this.deleteClient(key);
      //this.tostr.warning("Deleted Successfully", "Client register");
    }
  }

}
