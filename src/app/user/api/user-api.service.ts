import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { UserResponse } from '../type/user-list.types';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private readonly httpClient = inject(HttpClient);

  getUsers(): Observable<UserResponse> {
    return this.httpClient.get<UserResponse>(environment.apiUrl + '?results=30');
  }
}
