import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/users/users.service';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './users.component.html',
  imports: [
    NgForOf
  ],
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data.user;
        console.log('Users fetched successfully:', data);
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }
}
