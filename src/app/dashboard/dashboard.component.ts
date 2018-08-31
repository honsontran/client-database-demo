import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
//import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/*import { Client } from '../clients/shared/client.model';
import { ClientsService } from '../clients/shared/client.service';*/

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

	problemsArr: Observable<any[]>;

	constructor(public firebase : AngularFireDatabase) {

		//this.problemsArr = this.clientsSvc.getProblems();
		//console.log(this.problemsArr.length);
	}

	ngOnInit() {
		this.problemsArr = this.getProblems();
	}

	getProblems() {
	  return this.firebase
	    .list('/clients', ref =>
	      ref
	        .orderByChild('resolved')
	        .equalTo('Yes')
	    )
	    .snapshotChanges()
	    .distinctUntilChanged()
	    .map(changes => {
	      return changes.map(c => {
	        //console.log('key ' + c.payload.key);
	        //console.log(c.payload.val());
	        return { $key: c.payload.key, ...c.payload.val() };
	      });
	    });		
	}

}
