import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { AlertController, IonItem, IonInput, IonTextarea, IonButton, IonModal, IonContent, IonDatetime, IonToggle, IonLabel, IonSelectOption, IonSelect, IonItemDivider } from '@ionic/angular/standalone';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import moment from 'moment';
import { NgForm, FormsModule } from '@angular/forms';
import { Place } from 'src/app/place/shared/place.model';
import { Flight } from 'src/app/flight/shared/flight.model';
import { Glider } from 'src/app/glider/shared/glider.model';
import { TandemSchoolData } from 'src/app/flight/shared/tandem-school-data.model';
import { DatePipe } from '@angular/common';
import { GliderSelectComponent } from '../../shared/components/glider-select/glider-select.component';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { IgcMapComponent } from '../../shared/components/igc-map/igc-map.component';
import { School, CustomFieldDefinition } from 'src/app/school/shared/school.model';

@Component({
    selector: 'flight-form',
    templateUrl: 'flight-form.html',
    styleUrls: ['./flight-form.scss'],
    imports: [
        FormsModule,
        GliderSelectComponent,
        AutocompleteComponent,
        IgcMapComponent,
        DatePipe,
        TranslateModule,
        IonItem,
        IonInput,
        IonTextarea,
        IonButton,
        IonModal,
        IonContent,
        IonDatetime,
        IonToggle,
        IonLabel,
        IonSelect,
        IonSelectOption
    ]
})
export class FlightFormComponent implements OnInit, OnChanges {

    @Input()
    flight: Flight;
    @Input()
    gliders: Glider[];
    @Input()
    schools: School[];
    @Input()
    tandemSchools: School[];
    @Input()
    igcFileEdit: any;
    @Input()
    igcFile: string
    @Input()
    hideSaveButton: boolean = false;

    @Output()
    saveFlight = new EventEmitter<Flight>();

    searchStart: string;
    searchLanding: string;
    progress: number;
    uploadSuccessful = false;
    language;
    customFieldValues: { [key: string]: any } = {};

    constructor(
        private alertController: AlertController,
        private translate: TranslateService
    ) {
        this.language = this.translate.currentLang;
    }

    async ngOnInit() {
        if (!this.flight.start) {
            this.flight.start = new Place();
        }

        if (!this.flight.landing) {
            this.flight.landing = new Place();
        }
        
        if (this.flight.tandemSchoolData === null || this.flight.tandemSchoolData === undefined) {
            this.flight.tandemSchoolData = new TandemSchoolData();
        }
        
        this.initializeCustomValues();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['flight'] && this.flight) {
            this.initializeCustomValues();
        }
    }

    async submitForm({ valid }: NgForm) {
        // Ensure boolean fields are initialized before validation
        this.ensureBooleanFieldsInitialized();
        
        const customFieldsValid = this.validateCustomFields();
        
        if (valid && customFieldsValid) {
            this.formatDate();
            this.saveFlight.emit(this.flight);
        } else {
            await this.showAlert();
        }
    }
    
    private validateCustomFields(): boolean {
        const activeFields = this.getActiveCustomFields();
        
        for (const field of activeFields) {
            if (field.required && !field.disabled) {
                const value = this.getCustomFieldValue(field.key);

                // For boolean fields, false is a valid value
                if (field.type === 'boolean') {
                    if (value === null || value === undefined) {
                        return false;
                    }
                    continue;
                }
                
                // For other fields, check for empty values
                if (value === null || value === undefined || value === '') {
                    return false;
                }
            }
        }
        
        return true;
    }

    private async showAlert() {
        const alert = await this.alertController.create({
            header: this.translate.instant('message.errortitle'),
            message: this.translate.instant('message.mendatoryFields'),
            buttons: [this.translate.instant('buttons.done')]
        });
        await alert.present();
    }

    private formatDate() {
        const validNumber = !Number.isNaN(Date.parse(this.flight.time));
        if (validNumber) {
            this.flight.time = moment(this.flight.time).format('HH:mm:ss');
        }
    }

    setDefaultTime() {
        if (!this.flight.time) {
            this.flight.time = "00:00"
        }
    }

    cancelButton() {
        this.flight.time = null;
    }

    setFilteredStart(event: any) {
        this.searchStart = event.target.value;
    }

    setFilteredLanding(event: any) {
        this.searchLanding = event.target.value;
    }

    setStartInput(event: any) {
        this.flight.start.name = event.name;
    }

    setLandingInput(event: any) {
        this.flight.landing.name = event.name;
    }

    clearSchoolButton() {
        this.flight.tandemSchoolData.tandemSchool = null;
    }

    compareSchools(school1: School, school2: School): boolean {
        return school1 && school2 ? school1.id === school2.id : school1 === school2;
    }

    getActiveCustomFields(): CustomFieldDefinition[] {
        if (!this.flight.tandemSchoolData?.tandemSchool?.configuration?.tandemModule?.flightConfig?.customFields) {
            return [];
        }

        const fields = this.flight.tandemSchoolData.tandemSchool.configuration.tandemModule.flightConfig.customFields;
        
        return fields.filter(field => {
            if (!field.disabled) {
                return true;
            }
            
            const existingValue = this.getCustomFieldValue(field.key);
            return existingValue !== null && existingValue !== undefined;
        });
    }

    getCustomFieldValue(key: string): any {
        if (!this.flight.tandemSchoolData?.schoolCustomValues) {
            return null;
        }
        
        const customValue = this.flight.tandemSchoolData.schoolCustomValues.find(cv => cv.key === key);
        return customValue ? customValue.value : null;
    }

    setCustomFieldValue(key: string, value: any): void {
        if (!this.flight.tandemSchoolData) {
            this.flight.tandemSchoolData = new TandemSchoolData();
        }
        
        if (!this.flight.tandemSchoolData.schoolCustomValues) {
            this.flight.tandemSchoolData.schoolCustomValues = [];
        }
        
        const existingIndex = this.flight.tandemSchoolData.schoolCustomValues.findIndex(cv => cv.key === key);
        
        if (existingIndex >= 0) {
            this.flight.tandemSchoolData.schoolCustomValues[existingIndex].value = value;
        } else {
            this.flight.tandemSchoolData.schoolCustomValues.push({ key, value });
        }
    }

    private ensureBooleanFieldsInitialized(): void {
        // Ensure schoolCustomValues array exists
        if (this.flight?.tandemSchoolData && !this.flight.tandemSchoolData.schoolCustomValues) {
            this.flight.tandemSchoolData.schoolCustomValues = [];
        }
        
        // Initialize only REQUIRED boolean fields to false if not set
        const allFields = this.flight?.tandemSchoolData?.tandemSchool?.configuration?.tandemModule?.flightConfig?.customFields || [];
        allFields.forEach(field => {
            if (field.type === 'boolean' && field.required && !field.disabled) {
                const existingValue = this.getCustomFieldValue(field.key);
                if (existingValue === null || existingValue === undefined) {
                    this.customFieldValues[field.key] = false;
                    this.setCustomFieldValue(field.key, false);
                }
            }
        });
    }

    private initializeCustomValues(): void {
        if (this.flight?.tandemSchoolData?.schoolCustomValues) {
            const newValues: { [key: string]: any } = {};
            this.flight.tandemSchoolData.schoolCustomValues.forEach(cv => {
                newValues[cv.key] = cv.value;
            });
            this.customFieldValues = newValues;
        } else {
            this.customFieldValues = {};
        }
    }
}
