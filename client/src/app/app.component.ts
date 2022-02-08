import { Component } from '@angular/core';
import { AuthService } from './shared/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    public auth: AuthService
  ) { }

  throwNewError() {
    throw new Error(`This will be a very long error message that we will see how long it extends over and what the close looks like!`);
  }
}
