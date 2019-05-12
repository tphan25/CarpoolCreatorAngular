import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { Person } from '../../models/Person';

@Component({
  selector: 'app-create-trip',
  templateUrl: './create-trip.component.html',
  styleUrls: ['./create-trip.component.css']
})
export class CreateTripComponent implements OnInit {
  @ViewChildren('guestItem') private guestItems: QueryList<ElementRef>;
  currGuestIndex: number;
  guests: Person[];

  guestsInfo = new FormGroup({
    guestName: new FormControl(''),
    guestAddress: new FormControl(''),
    guestCanDrive: new FormControl(''),
    guestCapacity: new FormControl('')
  });

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
    guestList: new FormArray([
    ])

  });

  formPage: number;
  formPageArray: string[];

  constructor() { }

  ngOnInit() {
    this.formPage = 0;
    this.currGuestIndex = 0;
    this.guests = [];
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

  guestListClick(i) {
    this.guestItems.toArray()[this.currGuestIndex].nativeElement.active = false;
    this.guestItems.toArray()[this.currGuestIndex].nativeElement.style = "background-color: white";
    this.currGuestIndex = i;
    this.guestItems.toArray()[this.currGuestIndex].nativeElement.active = true;
    this.guestItems.toArray()[this.currGuestIndex].nativeElement.style = "background-color: #007BFF; color: white;";
  }

  addGuest() {
    // Uses a deep clone of the function and pushes into array, as the current state of the formgroup was previously being used
    const tempGuestInfo = this.cloneAbstractControl(this.guestsInfo);
    (this.tripForm.get('guestList') as FormArray).push(tempGuestInfo);
    this.guestsInfo.reset();
    this.guests.push({
      name: tempGuestInfo.get('guestName').value,
      address: tempGuestInfo.get('guestAddress').value,
      canDrive: tempGuestInfo.get('guestCanDrive').value,
      capacity: tempGuestInfo.get('guestCapacity').value
    });
  }

  printTripInfo() {
    console.log(this.tripForm);
  }

  /**
   * Deep clones the given AbstractControl, preserving values, validators, async validators, and disabled status.
   * Thanks to: https://stackoverflow.com/questions/48308414/deep-copy-of-angular-reactive-form
   * TODO: Copy other values of form, i.e. pristine, touched, etc
   * @param control AbstractControl
   * @returns AbstractControl
   */
  cloneAbstractControl<T extends AbstractControl>(control: T): T {
    let newControl: T;

    if (control instanceof FormGroup) {
      const formGroup = new FormGroup({}, control.validator, control.asyncValidator);
      const controls = control.controls;

      Object.keys(controls).forEach(key => {
        formGroup.addControl(key, this.cloneAbstractControl(controls[key]));
      })

      newControl = formGroup as any;
    } else if (control instanceof FormArray) {
      const formArray = new FormArray([], control.validator, control.asyncValidator);

      control.controls.forEach(formControl => formArray.push(this.cloneAbstractControl(formControl)))

      newControl = formArray as any;
    } else if (control instanceof FormControl) {
      newControl = new FormControl(control.value, control.validator, control.asyncValidator) as any;
    } else {
      throw new Error('Error: unexpected control value');
    }

    if (control.disabled) { newControl.disable({ emitEvent: false }); }

    return newControl;
  }
}
