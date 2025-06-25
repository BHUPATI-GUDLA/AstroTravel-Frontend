import { Component, ElementRef, viewChild, inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTimepickerModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  paymentRef = viewChild('paymentRef', { read: ElementRef });

  travelForm: FormGroup;

  private platformId = inject(PLATFORM_ID);

  constructor(private fb: FormBuilder) {
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


  // ngOnInit(): void {
  //   if (isPlatformBrowser(this.platformId)) {
  //     console.log('PayPal object:', (window as any).paypal);
  //     const paypal = (window as any).paypal;
  //     paypal.Buttons().render(this.paymentRef()?.nativeElement);
  //   //   paypal.Buttons(
  //   //     {
  //   //         style: {
  //   //           layout: 'horizontal',
  //   //           color: 'blue',
  //   //           shape: 'rect',
  //   //           label: 'paypal'
  //   //         }
  //   //     }
  //   //   ).render(this.paymentRef()!.nativeElement);
  //   // }
  // }

  ngAfterViewInit(): void {
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
              console.log("Below is the order details.");
              console.log(details);
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

  onSubmit() {
    console.log(this.travelForm.value);
  }

}
