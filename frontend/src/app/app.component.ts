import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FormsModule} from "@angular/forms";
import { ApiService } from './api.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {

  data: any;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.fetchData().then(data => {
      this.data = data;
      console.log(this.data);
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
  }
}
