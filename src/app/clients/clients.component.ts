import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase} from 'angularfire2/database';

import { ClientsService } from './shared/client.service';
import { Client } from './shared/client.model';

declare var require: any;
const fields = ['ID', 'Name', 'SC', 'County', 'Program', 'Status', 'Issue', 'Desc'];
const json2csv = require('json2csv').Parser;

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

  clientArr: Client[];
  supportsArr: Client[];
  ccpArr: Client[];

  constructor(private clientsSvc: ClientsService, public firebase : AngularFireDatabase) { }

  ngOnInit() {
  	var x = this.clientsSvc.getData();
  	x.snapshotChanges().subscribe(item => {
      this.clientArr = [];
      this.supportsArr = [];
      this.ccpArr = [];

  	  item.forEach(element => {
  	    var y : any = element.payload.toJSON();
        this.clientArr.push(y as Client);

        if (y.program == 'Supports') {
          this.supportsArr.push(y as Client);
        }

        else if (y.program == 'CCP') {
          this.ccpArr.push(y as Client);
        }
        
  	  });
  	});
  }

  toCSV(mode : string) {
    try {
      const parser = new json2csv(fields);
         
      if (mode == 'all') {
        var filename = 'report.csv';
        const csv = parser.parse(this.clientArr);
        var blob = new Blob([csv], {type: "text/csv;charset=utf-8;"});
      }

      else if (mode == 'Supports') {
        var filename = 'supports.csv';
        const csv = parser.parse(this.supportsArr);
        var blob = new Blob([csv], {type: "text/csv;charset=utf-8;"});     
      }

      else if (mode == 'CCP') {
        var filename = 'ccp.csv';;
        const csv = parser.parse(this.ccpArr);
        var blob = new Blob([csv], {type: "text/csv;charset=utf-8;"});
      }

      if (navigator.msSaveBlob)
      { // IE 10+
        navigator.msSaveBlob(blob, filename)
      }
      else
      {
        var link = document.createElement("a");
        if (link.download !== undefined) {

          // feature detection, Browsers that support HTML5 download attribute
          var url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }  
      //console.log(csv);
    } catch (err) {
      console.error(err);
    }
  }

}
