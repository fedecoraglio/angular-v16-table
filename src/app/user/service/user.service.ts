import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';

import { UserApiService } from '../api/user-api.service';
import {
  Info,
  OrderMode,
  Result,
  OrderBy,
  UserResponse,
} from '../type/user-list.types';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly userApiService = inject(UserApiService);
  private readonly _userResult$ = new BehaviorSubject<Result[]>([]);
  private readonly _userInfo$ = new BehaviorSubject<Info | null>(null);

  readonly userResult$ = this._userResult$.asObservable();
  readonly userInfo$ = this._userInfo$.asObservable();

  getUsers(): Observable<UserResponse> {
    return this.userApiService.getUsers().pipe(
      tap((userResponse) => {
        this._userResult$.next(userResponse.results);
        this._userInfo$.next(userResponse.info);
      }),
    );
  }

  searchUser(orderBy: OrderBy | null = null, mode: OrderMode | null = null) {
    const userResult = this._userResult$.value;
    this._userResult$.next(this.transformData(userResult, orderBy, mode));
  }

  deleteUser(email: string): Observable<Result[]> {
    return this._userResult$.pipe(
      take(1),
      tap((users) => {
        const newUsers = users.filter((user) => user.email !== email);
        this._userResult$.next(newUsers);
      }),
    );
  }

  private transformData(
    result: Result[],
    orderBy: OrderBy | null = null,
    mode: OrderMode | null = null,
  ): Result[] {
    if (orderBy) {
      return result.sort((a, b) => {
        const order = this.getField(a, b, orderBy);
        if (order) {
          if (order.valueA > order.valueB) {
            return mode === OrderMode.DES ? -1 : 1;
          } else if (order.valueA < order.valueB) {
            return mode === OrderMode.DES ? 1 : -1;
          } else {
            return 0;
          }
        }
        return 0;
      });
    }
    return result;
  }

  private getField(
    a: Result,
    b: Result,
    orderBy: OrderBy,
  ): { valueA: string; valueB: string } | null {
    if (OrderBy.country === orderBy) {
      return { valueA: a.location.country, valueB: b.location.country };
    } else if (OrderBy.lastName === orderBy) {
      return { valueA: a.name.last, valueB: b.name.last };
    }
    return { valueA: a.name.first, valueB: b.name.first };
  }
}
