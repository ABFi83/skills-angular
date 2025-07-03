import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface BreadcrumbItem {
  label: string;
  url: string;
  isLast: boolean;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: BreadcrumbItem[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.buildBreadcrumbs();
      });

    this.buildBreadcrumbs();
  }

  private buildBreadcrumbs(): void {
    const url = this.router.url;
    const pathnames = url.split('/').filter(x => x && x !== 'main');

    this.breadcrumbs = [
      { label: 'Home', url: '/main', isLast: false }
    ];

    pathnames.forEach((path, index) => {
      const url = '/' + pathnames.slice(0, index + 1).join('/');
      const isLast = index === pathnames.length - 1;

      let label = decodeURIComponent(path);
      if (path === 'project') {
        return; // Skip 'project' in breadcrumb
      }

      this.breadcrumbs.push({
        label: label,
        url: url,
        isLast: isLast
      });
    });

    // Set the last item as last
    if (this.breadcrumbs.length > 0) {
      this.breadcrumbs.forEach(item => item.isLast = false);
      this.breadcrumbs[this.breadcrumbs.length - 1].isLast = true;
    }
  }
}
