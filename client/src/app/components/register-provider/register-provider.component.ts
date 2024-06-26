import { Component, OnInit } from '@angular/core';
import { EnergyService } from 'src/app/service/energy.service';

@Component({
  selector: 'app-register-provider',
  templateUrl: './register-provider.component.html',
  styleUrls: ['./register-provider.component.css']
})
export class RegisterProviderComponent implements OnInit {
  name = '';
  energyAvailable = 0;
  pricePerUnit = 0;
  constructor( private energyService: EnergyService) { }

  ngOnInit(): void {
  }



}
