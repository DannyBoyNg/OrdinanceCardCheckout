export interface Log {
    Id: number;
    Timestamp: string;
    Action: string;
    UserId?: number;
    CardId: number;
    Borrower?: string;

    Name?: string;
    BarCode?: string;
}