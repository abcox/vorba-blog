import { Component } from '@angular/core';

interface Contact {
  name: string;
  email: string;
}

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent {
  title = 'Scheduler';

  availableTimes = ['1:00','1:15','1:30'];

  contact = {} as Contact;

  selectTime(selectedTime: string) {
    console.log(`selectedTime: ${selectedTime}`);
  }
}
