import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { UserService } from '../service/user.service';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { OrderBy, OrderMode } from '../type/user-list.types';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, AsyncPipe],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit, OnDestroy {
  private readonly userService = inject(UserService);
  private readonly destroy$ = new Subject<void>();
  readonly showResult$ = new Subject<OrderBy | null>();
  readonly userResult$ = this.userService.userResult$;
  readonly deleteUserItem$ = new Subject<string>();
  readonly country = OrderBy.country;
  readonly firstName = OrderBy.firstName;
  readonly lastName = OrderBy.lastName;
  currentOrderMode: OrderMode = OrderMode.AS;

  ngOnInit(): void {
    this.showResult$
      .pipe(
        tap((order: OrderBy | null) =>
          this.userService.searchUser(order, this.currentOrderMode),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.userService.getUsers().pipe(takeUntil(this.destroy$)).subscribe();

    this.deleteUserItem$
      .pipe(
        switchMap((email: string) => {
          return this.userService.deleteUser(email);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  deleteUser(email: string) {
    this.deleteUserItem$.next(email);
  }

  orderBy(order: OrderBy) {
    this.currentOrderMode =
      this.currentOrderMode === OrderMode.AS ? OrderMode.DES : OrderMode.AS;
    this.showResult$.next(order);
  }
}
