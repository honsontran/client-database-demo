import { Component, OnInit, Input } from '@angular/core';
import { Client } from '../clients/shared/client.model';
import { ClientsService } from '../clients/shared/client.service'
import { AngularFireDatabase, AngularFireList } from '../../../node_modules/angularfire2/database';
import { Observable } from 'rxjs/observable';

import { AuthService } from '../core/auth.service';


@Component({
  selector: 'app-caseload',
  templateUrl: './caseload.component.html',
  styleUrls: ['./caseload.component.css']
})
export class CaseloadComponent implements OnInit {

	clientList: Client[];
	clientMasterList: Client[];
  caseloadList: AngularFireList<any>;
  caseloadArr: Observable<any[]>;
  caseloadObjArr: Client[];
  name: string;

	constructor(public auth: AuthService, private clientService : ClientsService, public firebase: AngularFireDatabase, /*private tostr: ToastrService*/) {
	}

	ngOnInit() {
		//this.receiveMessage(Event);
		console.log('caseload component can see auth.name:');
		console.log(this.auth.name);
		if (this.auth.name == null) {
			console.log('this is null');
		}
		this.caseloadArr = this.getCaseload(this.auth.name);

    var x = this.getCaseloadData(this.auth.name);
		x.snapshotChanges().subscribe(item => {
		  this.clientList = [];
		  item.forEach(element => {
		    var y = element.payload.toJSON();
		    y["$key"] = element.key;
		    this.clientList.push(y as Client);
		  });
		});

		var x_master = this.clientService.getData();
		x_master.snapshotChanges().subscribe(item => {
		  this.clientMasterList = [];
		  item.forEach(element => {
		    var y_master = element.payload.toJSON();
		    y_master["$key"] = element.key;
		    this.clientMasterList.push(y_master as Client);
		  });
		});
	}

	// receiveMessage($event) {
	// 	this.name = $event;
	// }

	getName(username: string) {
		console.log('username is:');
		console.log(username);
		this.name = username;
	}

  getCaseloadData(name: string){
	  this.caseloadList = this.firebase.list('clients', ref =>
	  	ref
	  		.orderByChild('SC')
	  		.equalTo(name)
	  );

	  return this.caseloadList;
  }
  
  getCaseload(name: string) {
	  return this.firebase
	    .list('/clients', ref =>
	      ref
	        .orderByChild('SC')
	        .equalTo(name)
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

	onEdit(client: Client) {
	    this.clientService.selectedClient = Object.assign({}, client);
	  }
	 
	onDelete(key: string) {
		if (confirm('Are you sure to delete this record ?') == true) {
		  this.clientService.deleteClient(key);
		  //this.tostr.warning("Deleted Successfully", "Client register");
		}
  }
  
}
