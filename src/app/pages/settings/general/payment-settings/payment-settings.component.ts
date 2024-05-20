import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { appRoutes } from 'src/app/config/routes';

@Component({
  selector: 'app-payment-settings',
  templateUrl: './payment-settings.component.html',
  styleUrls: ['./payment-settings.component.scss']
})
export class PaymentSettingsComponent implements OnInit {
  appRoutes = appRoutes;
  details: any;
  form: FormGroup = new FormGroup({});

  constructor() { }

  ngOnInit(): void {
    this.form = new FormGroup({
      paymentGateway: new FormControl('', Validators.required),
      
    })
  }

}
