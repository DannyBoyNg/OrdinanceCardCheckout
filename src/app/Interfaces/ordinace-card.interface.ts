export interface OrdinanceCard {
    Id: number;
    BarCode: string;
    Language: string;
    CheckedOut: boolean;
    CheckedOutBy?: string;
    CheckedOutAt?: string;
}