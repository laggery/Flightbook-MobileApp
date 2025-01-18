import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { IonIcon } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { star } from "ionicons/icons";

@Component({
    selector: 'fb-star-rating',
    templateUrl: './star-rating.component.html',
    styleUrls: ['./star-rating.component.scss'],
    standalone: true,
    imports: [NgFor, NgClass, IonIcon]
})
export class StarRatingComponent {
    @Input()
    selectedRating: number | undefined;

    @Input()
    edit: boolean = true;

    @Output() selectEvent = new EventEmitter<number>();

    stars: any[];

    constructor() {
        addIcons({ star });
     }

    ngOnInit(): void {
        let className = this.edit ? 'star-gray star-hover star' : 'star-gray star';

        this.stars = [
            {
                id: 1,
                icon: 'star',
                class: className
            },
            {
                id: 2,
                icon: 'star',
                class: className
            },
            {
                id: 3,
                icon: 'star',
                class: className
            }
        ]
        this.displayStars(this.selectedRating || 0);
    }

    displayStars(value: number): void {
        this.stars.filter((star) => {
            if (star.id <= value) {
                star.class = `star-gold star`;
            } else {
                star.class = `star-gray star`;
            }
            return star;
        });
    }


    selectStar(value: any): void {
        if (!this.edit) {
            return;
        }

        if (this.selectedRating === value) {
            value = value - 1;
        }
        this.displayStars(value);

        this.selectedRating = value;
        this.selectEvent.emit(this.selectedRating);
    }

}
