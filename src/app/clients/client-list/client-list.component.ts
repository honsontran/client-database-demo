import { Component, OnInit } from '@angular/core';

import { ClientsService } from '../shared/client.service';
import { Client } from '../shared/client.model';
//import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {

	clientList: Client[];

	constructor(private clientService : ClientsService, /*private tostr: ToastrService*/) { }

	ngOnInit() {
		var x = this.clientService.getData();
		x.snapshotChanges().subscribe(item => {
		  this.clientList = [];
		  item.forEach(element => {
		    var y = element.payload.toJSON();
		    y["$key"] = element.key;
		    this.clientList.push(y as Client);
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
