export enum CustomFieldType {
    TEXT = 'text',
    NUMBER = 'number',
    DATE = 'date',
    BOOLEAN = 'boolean',
    DROPDOWN = 'dropdown'
}

export interface CustomFieldDefinition {
    key: string;
    label: string;
    type: CustomFieldType;
    required: boolean;
    disabled: boolean;
    options?: string[];
}

export interface FlightConfig {
    customFields: CustomFieldDefinition[];
}

export interface TandemModule {
    termsAndConditionsLink?: string;
    flightConfig?: FlightConfig;
}

export interface SchoolConfiguration {
    tandemModule?: TandemModule;
}

export class School {
    id: number;
    name: string;
    address1: string;
    address2: string;
    plz: string;
    city: string;
    phone: string;
    email: string;
    timezone: string;
    configuration?: SchoolConfiguration;
}
