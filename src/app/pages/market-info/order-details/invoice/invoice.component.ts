import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  invoiceNo = 'INV-12345';
  invoiceDate = '2024-05-27';
  dueDate = '2024-06-27';
  poNumber = 'PO-67890';
  natureOfSale = 'B2B';
  saleAgainst = 'GST';
  placeOfSupply = 'Haryana';
  channel = 'Online';
  subChannel = 'Retail';
  paymentMode = 'Credit Card';
  subscriptionPlan = 'Premium';
  invoiceAmount = '5000.00';
  totalSavings = '500.00';
  amountToBeCollected = '4500.00';
  billToName = 'John Doe';
  billToAddressLine1 = '123 Street Name';
  billToAddressLine2 = 'Area Name';
  billToCity = 'City';
  billToState = 'State';
  billToZip = '123456';
  shipToName = 'Jane Doe';
  shipToAddressLine1 = '456 Street Name';
  shipToAddressLine2 = 'Area Name';
  shipToCity = 'City';
  shipToState = 'State';
  shipToZip = '123456';
  items = [
    {
      description: 'Item 1',
      code: 'HSN001',
      qty: 10,
      mou: 'Nos',
      unitPrice: 100,
      grossAmount: 1000,
      discPercent: 10,
      discAmount: 100,
      gstPercent: 18,
      gstAmount: 162,
      cessPercent: 1,
      cessAmount: 10,
      tcsPercent: 1,
      tcsAmount: 10,
      total: 1082
    },
    // Add more items as needed
  ];
  totalGrossAmount = '1000.00';
  totalDiscount = '100.00';
  totalGst = '162.00';
  totalCess = '10.00';
  totalTcs = '10.00';
  netAmount = '1082.00';
  constructor() { }

  ngOnInit(): void {
  }
  

}
