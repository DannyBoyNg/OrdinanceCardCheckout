export interface OrdinanceCard {
    Id: number;
    Title?: string;
    BarCode: string;
    Language: string;
    CheckedOut: number;
    CheckedOutBy?: string;
    CheckedOutTo?: string;
    CheckedOutAt?: string;
}