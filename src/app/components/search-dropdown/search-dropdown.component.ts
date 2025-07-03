import { Component, Input, Output, EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-search-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-dropdown.component.html',
  styleUrl: './search-dropdown.component.css'
})
export class SearchDropdownComponent implements OnInit, OnChanges {
  @Input() placeholder: string = '';
  @Input() fetchItems!: (query: string) => Promise<any[]>;
  @Input() initialValue: string = '';
  @Input() readOnly: boolean = false;
  @Output() itemSelect = new EventEmitter<any>();

  items: any[] = [];
  searchQuery: string = '';
  isDropdownVisible: boolean = false;
  isLoading: boolean = false;

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.searchQuery = this.initialValue;

    if (!this.readOnly) {
      this.searchSubject.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(query => {
          if (query.trim().length > 0) {
            this.isLoading = true;
            return this.fetchItemsAsync(query);
          } else {
            this.items = [];
            this.isDropdownVisible = false;
            return of([]);
          }
        })
      ).subscribe(items => {
        this.items = items;
        this.isLoading = false;
        this.isDropdownVisible = items.length > 0 || this.searchQuery.trim().length > 0;
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialValue'] && changes['initialValue'].currentValue !== undefined) {
      this.searchQuery = this.initialValue;
    }
  }

  onInputChange(value: string): void {
    this.searchQuery = value;
    this.searchSubject.next(value);
  }

  onItemSelect(item: any): void {
    this.itemSelect.emit(item);
    this.searchQuery = item.name || '';
    this.isDropdownVisible = false;
    this.items = [];
  }

  private async fetchItemsAsync(query: string): Promise<any[]> {
    try {
      return await this.fetchItems(query);
    } catch (error) {
      console.error('Error loading items:', error);
      return [];
    }
  }
}
