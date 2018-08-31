import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import { Client } from '../../clients/shared/client.model';
import { ClientsService } from '../../clients/shared/client.service';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../core/auth.service';
import { DashAllComponent } from '../dash-all/dash-all.component'

@Component({
  selector: 'app-dash-documents',
  templateUrl: './dash-documents.component.html',
  styleUrls: ['./dash-documents.component.css']
})
export class DashDocumentsComponent extends DashAllComponent implements OnInit {

  problemsArr: Observable<any[]>;
	problemsList: AngularFireList<any>;
  problemsObjArr: Client[];
  
  constructor(public auth: AuthService, public clientsSvc: ClientsService, public firebase : AngularFireDatabase, public tostr: ToastrService) {
    super(auth, clientsSvc, firebase, tostr);
  }

	ngOnInit() {
		this.problemsArr = this.getDocuments();
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
  
  getDocuments() {
	  return this.firebase
	    .list('/clients', ref =>
	      ref
	        .orderByChild('issue')
	        .equalTo('Missing Documentation')
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
