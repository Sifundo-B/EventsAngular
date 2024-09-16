export interface Notification {
    id: number;
    message: string;
    date: Date;
    isRead: boolean;
    event: {
        id: number;
    };
    recipient: {
        userId: number;
    };
    type: string;
}
