import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'
 
import { ClientsService } from '../shared/client.service';
import { AuthService } from '../../core/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})

export class ClientComponent implements OnInit {
 
  issueOptions = ['Monthly Contacts', 'Missing Documentation', 'Annuals', 'Other', 'None'];

  resolvedOptions = ['Yes', 'No'];

  countyOptions = ['Atlantic', 'Bergen', 'Burlington', 'Camden', 'Cape May', 'Cumberland', 'Essex', 'Gloucester', 'Hudson', 'Hunterdon', 'Mercer', 'Middlesex', 'Monmouth', 'Morris', 'Ocean', 'Passaic', 'Salem', 'Somerset', 'Sussex', 'Union', 'Warren'];

  programOptions = ['CCP', 'Supports', 'Interim'];

  statusOptions = ['Approved', 'In Review', 'Working'];

  staffOptions = ['Barbara Cid', 'Eileen Elsas', 'Honson Tran', 'Jackie Dunlap', 'Jacqueline Ulloa', 'Jerald Hornsby', 'Kalyn Holt', 'Marie Manherz', 'Marquita Hawkins', 'Natalie Espinoza', 'Sonserae Johnson', 'Theresa Cahill'];

  constructor(public auth: AuthService, private clientService: ClientsService, private tostr: ToastrService) { }
 
  ngOnInit() {
    this.resetForm();
  }
 
  onSubmit(clientForm: NgForm) {
    if (clientForm.value.$key == null) {
      this.clientService.insertClient(clientForm.value);
      this.tostr.success('Submitted Succcessfully', 'Client Registered');
    }

    else {
      this.clientService.updateClient(clientForm.value);
      this.tostr.info('Submitted Succcessfully', 'Client Updated');
    }
    
    this.resetForm(clientForm);
  }
 
  resetForm(clientForm?: NgForm) {
    if (clientForm != null)
      clientForm.reset();
      
    this.clientService.selectedClient = {
      $key: null,
      name: '',
      SC: '',
      id: '',
      county: null,
      program: '',
      status: null,
      issue: 'None',
      resolved: 'No',
      desc: ''
    }
  }
 
}