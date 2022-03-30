import { Component } from '@angular/core';

@Component({
    selector: 'app-garage',
    templateUrl: './garage.component.html'
})
export class GarageComponent {
    vehicles = [{
        year: 2001,
        manufacturer: 'Audi',
        model: 'S4'
    }, {
        year: 2013,
        manufacturer: 'Volkswagen',
        model: 'Jetta GLI'
    }]

}
