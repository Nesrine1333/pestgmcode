import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() isCollapsed!: boolean;
  @Input() COMERCIO!: boolean;
  @Output() toggleSidebar = new EventEmitter<void>();

  ngOnInit() {
   
  }
  onToggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed; // Toggle the isCollapsed state
    this.toggleSidebar.emit(); // Emit the event if needed
  }
  isSidebarActive: boolean =true;

  // toggleSidebar() {
  //   this.isSidebarActive = !this.isSidebarActive;
  // }
}
