import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interface/user';
import { EnergyService } from 'src/app/service/energy.service';
import { LoginService } from 'src/app/service/login.service';
import Chart from 'chart.js/auto';


@Component({
  selector: 'app-provider-info',
  templateUrl: './provider-info.component.html',
  styleUrls: ['./provider-info.component.css']
})
export class ProviderInfoComponent implements OnInit {
  energyAmount!: number;
  message = '';
  consumerAddress = '';
  consumerBalance!: number;
  isRequestPending = false;
  balance: number = 0; 
  errorMessage: string | null = null;
  energyBalance: number | null = null;
  loggedInUser: User | null = null;
  isCollapsed = false;
  sidebarWidth = 0; 
  energyData = [10, 20, 30, 40, 50]; // Replace with actual data
  ethereumData = [5, 15, 25, 35, 45];
  constructor(private energyService: EnergyService ,private  userService:LoginService, private router: Router) {

  }
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
   
    this.updateSidebarWidth();

 
  }


  updateSidebarWidth() {
    this.sidebarWidth = this.isCollapsed ? 100 : 250; // Adjust collapsed and expanded widths as needed
  }
  async ngOnInit() {
    this.createEnergyChart();
    this.createEthereumChart();
   this.allproviders()
    this. userService.getLoggedInUserObservable().subscribe(user => {
      this.loggedInUser = user;
      if (!this.loggedInUser) {
      
        this.router.navigate(['/login']);
        console.log(this.loggedInUser);
      }
       
       else {
        this.getConsumerInfo();
      }
    });
  }
  createEnergyChart() {
    const ctx = document.getElementById('energyChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [{
          label: 'Energy Consumption',
          data: this.energyData,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // Function to create Ethereum Chart
  createEthereumChart() {
    const ctx = document.getElementById('ethereumChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [{
          label: 'Ethereum Price',
          data: this.ethereumData,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  etherBalance!: string;


  fetchConsumerEtherBalance() {
    this.energyService.getConsumerEtherBalance(this.consumerAddress)
      .subscribe(
        data => {
          this.etherBalance = data.balanceEther;
          console.log('Consumer Ether balance:', this.etherBalance);
        },
        error => {
          console.error('Failed to fetch consumer balance:', error);
        
        }
      );
  }

consumerInfo: any;

getConsumerInfo(): void {
  if (!this.loggedInUser || !this.loggedInUser.email) {
    this.errorMessage = 'Email is required';
    return;
  }

  this.energyService.getConsumerInfo(this.loggedInUser.email).subscribe(
    response => {
      this.consumerInfo = response;
      this.errorMessage = '';
      console.log(response);
      
    },
    error => {
      console.log(this.loggedInUser?.email);
      
      console.error('Error fetching consumer info:', error);
      this.errorMessage = 'Failed to fetch consumer info';
    }
  );
}


getEtherBalance(){
  this.energyService. getConsumerEtherBalance(this.consumerAddress).subscribe((enther) =>{
    this.etherBalance=enther.balanceEther;
    console.log(this.etherBalance);
    
  },
  error => {
    console.error('Error fetching ether balance:', error);
  })
}


buyEnergy() {
  console.log(this.consumerInfo.address);
  
  // Check if MetaMask is connected (if applicable)
  if (!this.loggedInUser?.email) {
      this.message = 'MetaMask not connected';
      return;
  }

  // Check if energyAmount is valid
  if (!this.energyAmount || this.energyAmount <= 0) {
      this.message = 'Please enter a valid energy amount';
      return;
  }

  // Check if a request is already pending
  if (this.isRequestPending) {
      this.message = 'Please wait for the current transaction to complete';
      return;
  }

  // Set the request pending flag
  this.isRequestPending = true;
  this.message = 'Processing transaction...';

  // Call the energyService to buy energy
  this.energyService.buyEnergy( this.loggedInUser.email,this.energyAmount, this.consumerInfo.address).subscribe(
      response => {
          this.message = 'Energy purchase successful!';
          this.isRequestPending = false;
          console.log(response);
      },
      error => {
          this.message = 'Energy purchase failed.';
          this.isRequestPending = false;
          console.error(error);
      }
  );
}

  allproviders(){
    this.energyService.getAllProviders().subscribe(
      resp=>{
        console.log(resp);
        
      }
    )
  }
}
