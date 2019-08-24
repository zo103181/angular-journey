import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular7-journey';

  throwNewError() {
    throw new Error(`This will be a very long error message that we will see how long it extends over and what the close looks like!`);
  }
}
