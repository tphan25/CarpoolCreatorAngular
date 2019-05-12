import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-trip',
  templateUrl: './create-trip.component.html',
  styleUrls: ['./create-trip.component.css']
})
export class CreateTripComponent implements OnInit {
  tripName = new FormControl('');
  tripForm = new FormGroup({
    // First section, tripFields
    tripInfo: new FormGroup({
      tripName: new FormControl(''),
      tripLocation: new FormControl(''),
      tripDate: new FormControl(''),
      tripDescription: new FormControl('')
    }),
    // Second section, hostFields
    hostInfo: new FormGroup({
      hostName: new FormControl(''),
      hostAddress: new FormControl(''),
      hostCanDrive: new FormControl(''),
      hostCapacity: new FormControl('')
    }),
    //How the heck do i do guests lmao
  });

  formPage: number;
  formPageArray: string[];

  constructor() { }

  ngOnInit() {
    this.formPage = 0;
    this.formPageArray = [
      'tripFields',
      'hostFields',
      'guestFields',
      'confirmationPage'
    ];
    for (let i = 1; i < this.formPageArray.length; i++) {
      document.getElementById(this.formPageArray[i]).style.display = 'none';
    }
  }

  onClickedNext() {
    if (this.formPage < this.formPageArray.length - 1) {
      this.formPage++;
    }
    document.getElementById(this.formPageArray[this.formPage - 1]).style.display = 'none';
    document.getElementById(this.formPageArray[this.formPage]).style.display = 'block';
    document.getElementById('progressBar').style.width = (100 * this.formPage / this.formPageArray.length).toString() + '%';
    if (this.formPage === this.formPageArray.length - 1) {
      (document.getElementById('nextButton') as HTMLInputElement).disabled = true;
    }
    (document.getElementById('prevButton') as HTMLInputElement).disabled = false;
  }

  onClickedPrev() {
    if (this.formPage > 0) {
      this.formPage--;
    }
    document.getElementById(this.formPageArray[this.formPage]).style.display = 'block';
    document.getElementById(this.formPageArray[this.formPage + 1]).style.display = 'none';
    document.getElementById('progressBar').style.width = (100 * this.formPage / this.formPageArray.length).toString() + '%';
    if (this.formPage === 0) {
      (document.getElementById('prevButton') as HTMLInputElement).disabled = true;
    }
    (document.getElementById('nextButton') as HTMLInputElement).disabled = false;
  }

}
