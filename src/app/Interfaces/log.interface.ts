export interface Log {
    Id: number;
    Timestamp: string;
    Action: string;
    UserId?: number;
    CardId: number;

    Name?: string;
    BarCode?: string;
}