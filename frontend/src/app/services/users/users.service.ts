// import { Injectable } from '@angular/core';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class UsersService {
//
//   constructor() { }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    console.log(this.apiUrl)
    return this.http.get<any>(this.apiUrl);
  }
}
