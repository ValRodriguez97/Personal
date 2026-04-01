import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryHouseResponse, CountryHouseService, AvailabilityResponse } from '../../../../Services/CountryHouse/country-house.service';
import { SearchParams } from '../hero-section/hero-section.component';

interface HouseWithAvailability extends CountryHouseResponse {
  availabilityLoaded: boolean;
  entireHouseAvailable: boolean | null;
  checkingAvailability: boolean;
}

@Component({
  selector: 'app-house-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './house-grid.component.html'
})
export class HouseGridComponent implements OnChanges {
  @Input() houses: CountryHouseResponse[] = [];
  @Input() loading = false;
  @Input() searchParams: SearchParams = { poblacion: '', fecha: '', noches: 2, tipoAlquiler: 'ambas' };
  @Input() hasSearched = false;

  enrichedHouses: HouseWithAvailability[] = [];

  constructor(private countryHouseService: CountryHouseService) {}

  get empty(): boolean {
    return !this.loading && this.hasSearched && this.enrichedHouses.length === 0;
  }

  get showInitialState(): boolean {
    return !this.loading && !this.hasSearched;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['houses']) {
      this.enrichedHouses = this.houses.map(h => ({
        ...h,
        availabilityLoaded: false,
        entireHouseAvailable: null,
        checkingAvailability: false
      }));

      if (this.searchParams.fecha && this.searchParams.noches > 0) {
        this.enrichedHouses.forEach(h => this.loadAvailability(h));
      }
    }
  }

  loadAvailability(house: HouseWithAvailability): void {
    if (!this.searchParams.fecha) return;
    house.checkingAvailability = true;

    this.countryHouseService.checkAvailability(
      house.code,
      this.searchParams.fecha,
      this.searchParams.noches
    ).subscribe({
      next: (res) => {
        const avail: AvailabilityResponse = res?.data;
        house.availabilityLoaded = true;
        house.checkingAvailability = false;
        if (avail?.dailyAvailability) {
          const days = Object.values(avail.dailyAvailability);
          house.entireHouseAvailable = days.every(d => d.entireHouseStatus === 'FREE');
        }
      },
      error: () => {
        house.checkingAvailability = false;
        house.availabilityLoaded = true;
      }
    });
  }

  getTotalBathrooms(house: CountryHouseResponse): number {
    return (house.privateBathrooms ?? 0) + (house.publicBathrooms ?? 0);
  }

  getFirstPhoto(house: CountryHouseResponse): string {
    return house.photo?.[0]?.url?.trim()
      ? house.photo[0].url
      : 'https://images.unsplash.com/photo-1572345901383-be2fcd1625f3?w=800&q=80';
  }

  trackByHouseId(_: number, house: CountryHouseResponse): string {
    return house.id;
  }
}
