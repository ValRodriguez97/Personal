import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent }        from './components/navbar/navbar.component';
import { HeroSectionComponent, SearchParams } from './components/hero-section/hero-section.component';
import { FilterSidebarComponent } from './components/filter-sidebar/filter-sidebar.component';
import { FilterTriggerComponent } from './components/filter-trigger/filter-trigger.component';
import { HouseGridComponent }     from './components/house-grid/house-grid.component';
import { FooterComponent }        from './components/footer/footer.component';
import { CountryHouseResponse }   from '../../Services/CountryHouse/country-house.service';

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
  isLoading    = false;
  hasSearched  = false;

  allHouses:      CountryHouseResponse[] = [];
  filteredHouses: CountryHouseResponse[] = [];
  searchParams:   SearchParams = { poblacion: '', fecha: '', noches: 2, tipoAlquiler: 'ambas' };

  toggleFilter() { this.isFilterOpen = !this.isFilterOpen; }
  closeFilter()  { this.isFilterOpen = false; }

  // El hero emite los resultados del backend
  onSearchResults(event: { houses: CountryHouseResponse[], params: SearchParams }): void {
    this.allHouses      = event.houses;
    this.filteredHouses = event.houses;
    this.searchParams   = event.params;
    this.hasSearched    = true;
    this.isLoading      = false;
  }

  onSearchLoading(): void {
    this.isLoading   = true;
    this.hasSearched = false;
  }

  // El sidebar emite el subconjunto filtrado localmente
  onFiltered(houses: CountryHouseResponse[]): void {
    this.filteredHouses = houses;
  }
}
