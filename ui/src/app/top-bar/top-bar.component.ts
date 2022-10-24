import { Component, OnInit } from '@angular/core';

import { AuthService } from '../shared/auth/auth.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
})
export class TopBarComponent {
  public user_id = '';
  constructor(public authService: AuthService) {}
  ngOnInit() {
    this.user_id = localStorage.getItem('user_id');
  }
  logout() {
    this.authService.doLogout();
  }
}
