import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'enegergytrading';

  sidebarActive!: boolean;
  toggleVisible: boolean = true;

  constructor() {}

  toggleSidebar() {
    this.sidebarActive = !this.sidebarActive;
  }

  closeSidebar() {
    this.sidebarActive = false;
  }

  ngOnInit() {
    
  this.sidebarActive=true ;

    this.checkWindowSize();
    window.addEventListener('resize', () => {
      this.checkWindowSize();
    });
  }

  checkWindowSize() {
    if (window.innerWidth <= 768) {
      this.toggleVisible = true;
    } else {
      this.toggleVisible = false;
      this.sidebarActive = false; // Close sidebar when window size changes to desktop view
    }
  }
}
