import { Component, ElementRef, viewChild, inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { isPlatformBrowser } from '@angular/common';
import { order } from '../../../entities/order';
import { LoginService } from '../../../services/login-service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { GenericResponse } from '../../../entities/generic-response';
import { DashboardResponse } from '../../../entities/dashboard-response';


@Component({
  selector: 'app-dashboard',
  providers: [provideNativeDateAdapter(), LoginService],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTimepickerModule,
    HttpClientModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  paymentRef = viewChild('paymentRef', { read: ElementRef });

  travelForm: FormGroup;

  private platformId = inject(PLATFORM_ID);
  private formDataSnapshot: any = null;
  paypalRendered = false;

  showResult = false;           // boolean to control visibility
  resultMessage = '';

  constructor(private fb: FormBuilder, private loginService: LoginService, private http: HttpClient) {
    this.travelForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      contact: [''],
      date: [''],
      month: [''],
      year: [''],
      time: ['']
    });
  }

  handleFormValidation() {
    if (this.travelForm.valid) {
      this.formDataSnapshot = this.travelForm.value;
      if (!this.paypalRendered) {
        this.renderPayPalButton();
        this.paypalRendered = true;
      }
    } else {
      alert("Please complete the form before proceeding to payment.");
    }
  }


  renderPayPalButton() {
    if (isPlatformBrowser(this.platformId)) {
      const paypal = (window as any).paypal;
      // paypal.Buttons().render(this.paymentRef()?.nativeElement);
      paypal.Buttons(
        {
          style: {
            layout: 'horizontal',
            color: 'blue',
            shape: 'rect',
            label: 'paypal'
          },
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: "5",
                    currency_code: 'USD'
                  }
                }
              ]
            })
          },
          onApprove: (data: any, actions: any) => {
            return actions.order.capture().then((details: any) => {
              alert("Payment is successful...")
              console.log(details);
              this.storeOrderDetails(details);
            })
          },
          onError: (error: any) => {
            console.log(error);
            alert("Payment is failed...")
          }
        }
      ).render(this.paymentRef()!.nativeElement);
    }
  }


  storeOrderDetails(details: any) {

    if (!this.formDataSnapshot) {
      alert("Form data is missing.");
      return;
    }

    // REMOVE BELOW CONSOLE
    console.log("Calling backend api");
    console.log('order id - ' + details.id);
    console.log('order create time - ' + details.create_time);
    console.log('payer country code - ' + details.payer.address.country_code);
    console.log('payer email address - ' + details.payer.email_address);
    console.log('payer first name - ' + details.payer.name.given_name);
    console.log('payer last name - ' + details.payer.name.surname);
    console.log('payer id - ' + details.payer.payer_id);
    console.log('currency code - ' + details.purchase_units[0].amount.currency_code);
    console.log('amount - ' + details.purchase_units[0].amount.amount);
    console.log('Payee email_address - ' + details.purchase_units[0].payee.email_address);
    console.log('Merchant id - ' + details.purchase_units[0].payee.merchant_id);
    console.log('Transaction status - ' + details.status);
    console.log('User First Name - ' + this.travelForm.get('firstName')?.value);
    console.log('User Last Name - ' + this.travelForm.get('lastName')?.value);
    console.log('User Contact Numbser - ' + this.travelForm.get('contact')?.value);
    console.log('Birth Date  - ' + this.travelForm.get('date')?.value);
    console.log('Birth Month  - ' + this.travelForm.get('month')?.value);
    console.log('Birth Year  - ' + this.travelForm.get('year')?.value);

    const orderDetails: order = {
      orderId: details.id,
      orderCreateTime: details.create_time,
      payerCountryCode: details.payer.address.country_code,
      payerEmailAddress: details.payer.email_address,
      payerFirstName: details.payer.name.given_name,
      payerLastName: details.payer.name.surname,
      payerId: details.payer.payer_id,
      currencyCode: details.purchase_units[0].amount.currency_code,
      amount: details.purchase_units[0].amount.value, // assuming 'amount.amount' was a typo, should be 'value'
      payeeEmailAddress: details.purchase_units[0].payee.email_address,
      merchantId: details.purchase_units[0].payee.merchant_id,
      transactionStatus: details.status,

      userFirstName: this.formDataSnapshot.firstName,
      userLastName: this.formDataSnapshot.lastName,
      userContactNumber: this.formDataSnapshot.contact,
      birthDate: this.formDataSnapshot.date,
      birthMonth: this.formDataSnapshot.month,
      birthYear: this.formDataSnapshot.year
    };

    this.loginService.createOrder(orderDetails).subscribe({
      next: (response: GenericResponse<any>) => {
        if (response.code === 'OK') {
          const DashboardResponse = response.body;
          console.log(DashboardResponse.result);
          this.resultMessage = DashboardResponse.result;
          this.showResult = true;
          this.paypalRendered = false;
        } else {
          alert('Order is not created. And server message ' + response.message);
        }
      },
      error: () => {
        alert('Failed to creat order at backend...');
      }
    });

  }

}
