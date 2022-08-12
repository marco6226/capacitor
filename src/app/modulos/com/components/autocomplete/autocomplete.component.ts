import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TreeModule } from '../tree/tree.component';

@Component({
    selector: 'sm-autocomplete',
    templateUrl: './autocomplete.component.html',
    styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent implements OnInit {
    @Input('options') _options: any;
    @Input('fieldLabel') fieldLabel: string;
    @Input('field') field: string;
    @Input('size') size: number = 10;
    @Input('minLength') minLength: number = 3;
    @Output('completeMethod') completeMethod = new EventEmitter<any>();
    inputValue: string;
    suggestions: any[];

    constructor() {}

    ngOnInit() {
        /*execute a function when someone clicks in the document:*/
        document.addEventListener('click', (e) => {
            this._options = [];
        });
    }

    onSearchChange(event: any) {
        let value = <string>event.target.value;
        if (value.length >= this.minLength) this.completeMethod.emit(value);
    }

    onSelect(opc: any) {
        this.inputValue = opc[this.field];
    }

    get options() {
        return this._options;
    }
    set options(options: any[]) {
        this._options = options;
    }
}
