import { Injectable } from '@angular/core';
import axios from 'axios';
import {data} from "autoprefixer";

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor() {}

  async fetchData() {
    try {
      let response = await axios.get('http://localhost:3000/api/');
      console.log(response.data.value.position)
      return response.data;
    } catch (error) {
      console.error('There was an error!', error);
      throw error;
    }
  }
}

