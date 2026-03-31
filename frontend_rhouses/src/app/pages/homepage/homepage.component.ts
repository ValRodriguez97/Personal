import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent }        from './components/navbar/navbar.component';
import { HeroSectionComponent }   from './components/hero-section/hero-section.component';
import { FilterSidebarComponent } from './components/filter-sidebar/filter-sidebar.component';
import { FilterTriggerComponent } from './components/filter-trigger/filter-trigger.component';
import { HouseGridComponent }     from './components/house-grid/house-grid.component';
import { FooterComponent }        from './components/footer/footer.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroSectionComponent,
    FilterSidebarComponent,
    FilterTriggerComponent,
    HouseGridComponent,
    FooterComponent
  ],
  templateUrl: './homepage.component.html'
})
export class HomepageComponent {
  isFilterOpen = false;

  toggleFilter() { this.isFilterOpen = !this.isFilterOpen; }
  closeFilter()  { this.isFilterOpen = false; }
}