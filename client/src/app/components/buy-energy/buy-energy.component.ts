import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interface/user';
import { EnergyService } from 'src/app/service/energy.service';
import { LoginService } from 'src/app/service/login.service';
import { Router } from '@angular/router'

declare let window: any;

@Component({
  selector: 'app-buy-energy',
  templateUrl: './buy-energy.component.html',
  styleUrls: ['./buy-energy.component.css']
})
export class BuyEnergyComponent implements OnInit {
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
    // await this.connectMetaMask();
    // this.fetchConsumerBalance();
    // this.getEtherBalance();
   this.allproviders()
    this. userService.getLoggedInUserObservable().subscribe(user => {
      this.loggedInUser = user;
      if (!this.loggedInUser) {
        // Redirect to login if no user is found
        this.router.navigate(['/login']);
        console.log(this.loggedInUser);
      }
       
       else {
        this.getConsumerInfo();
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
          // Handle error
        }
      );
  }
  // async connectMetaMask() {
  //   if (!window.ethereum) {
  //     this.message = 'MetaMask is not installed';
  //     return;
  //   }
  //   if (this.isRequestPending) {
  //     this.message = 'Request already pending. Please wait.';
  //     return;
  //   }
  //   try {
  //     this.isRequestPending = true;
  //     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  //     this.consumerAddress = accounts[0];
  //     this.message = 'MetaMask connected';
  //     console.log('MetaMask connected with account:', this.consumerAddress);
  //     // Fetch the consumer balance after connecting to MetaMask
  //     this.fetchConsumerBalance();
  //   } catch (error) {
  //     console.error('Error connecting MetaMask', error);
  //     this.message = 'Error connecting MetaMask';
  //   } finally {
  //     this.isRequestPending = false;
  //   }
  // }

//   fetchConsumerBalance(): void {
//     if (!this.consumerAddress) {
//       console.error('Consumer address not available');
//       return;
//     }
//  console.log(this.consumerAddress);
 
//     this.energyService.getConsumerBalance(this.consumerAddress)
//       .subscribe(
//         (balance:number) => {
//           this.consumerBalance = balance;
//           console.log('Consumer Balance:', this.consumerBalance);
//         },
//         error => {
//           console.error('Error fetching consumer balance:', error);
//         }
//       );
//   }


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

// getEnergyBalance() {
//   this.energyService.getConsumerEnergyBalance(this.consumerAddress).subscribe({
//     next: (data) => {
//       this.energyBalance = data.energyBalance;
//       this.errorMessage = null;
//     },
//     error: (error) => {
//       this.errorMessage = 'Error fetching energy balance. Please check the console for details.';
//       console.error(error);
//       this.energyBalance = null;
//     }
//   });
// }

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
