import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import { Client } from '../../clients/shared/client.model';
import { ClientsService } from '../../clients/shared/client.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/auth.service'
import { take } from '../../../../node_modules/rxjs/operator/take';
import { map } from '../../../../node_modules/rxjs/operator/map';
import { tap } from '../../../../node_modules/rxjs/operators';

@Component({
  selector: 'app-dash-all',
  templateUrl: './dash-all.component.html',
  styleUrls: ['./dash-all.component.css']
})
export class DashAllComponent implements OnInit {

	problemsArr: Observable<any[]>;
	problemsList: AngularFireList<any>;
	problemsObjArr: Client[];

	constructor(public auth: AuthService, public clientsSvc: ClientsService, public firebase : AngularFireDatabase, public tostr: ToastrService) {

		//this.problemsArr = this.clientsSvc.getProblems();
		//console.log(this.problemsArr.length);
	}

	ngOnInit() {
		this.problemsArr = this.getProblems();
		this.problemsList = this.clientsSvc.getData();

		var x = this.getProblemData();
		x.snapshotChanges().subscribe(item => {
		  this.problemsObjArr = [];
		  item.forEach(element => {
		    var y = element.payload.toJSON();
		    y["$key"] = element.key;
		    this.problemsObjArr.push(y as Client);
		  });
		});
	}

	getProblemData(){
	  this.problemsList = this.firebase.list('clients', ref =>
	  	ref
	  		.orderByChild('resolved')
	  		.equalTo('Yes')
	  );

	  return this.problemsList;
	}

	resolve(client : Client) {
		this.problemsList.update(client.$key,
			{
				name: client.name,
				id: client.id,
				county: client.county,
				program: client.program,
				status: client.status,
				resolved: 'No',
				issue: '',
				desc: ''	
			}
		);

		this.tostr.success('Client Resolved Successfully.', 'Another one down!');
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
