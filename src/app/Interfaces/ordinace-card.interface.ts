export interface OrdinanceCard {
    Id: number;
    BarCode: string;
    Language: string;
    CheckedOut: number;
    CheckedOutBy?: string;
    CheckedOutAt?: string;
}