import { Injectable } from '@angular/core';
import { BehaviorSubject, filter } from "rxjs";
import { Breadcrumb } from "../types/breadcrumb.type";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbsService {

  private readonly _breadcrumbs$: BehaviorSubject<Breadcrumb[]> = new BehaviorSubject<Breadcrumb[]>(null);

  get breadcrumbs$() {
    return this._breadcrumbs$.asObservable();
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(value => {
        const values = this.createBreadcrumbs(this.activatedRoute);
        this._breadcrumbs$.next(values);
      });
  }

  // @ts-ignore
  createBreadcrumbs(route: ActivatedRoute, breadcrumbs: Breadcrumb[] = []) {
    if (route.children.length === 0) {
      return breadcrumbs;
    }

    for (let child of route.children) {
      const label = route.snapshot.data['breadcrumb'];
      const url = route.snapshot.url.map(url => url.path).join('/');

      if (label) {
        breadcrumbs.push({ label, url });
      }

      return this.createBreadcrumbs(child, breadcrumbs);
    }
  }

}
