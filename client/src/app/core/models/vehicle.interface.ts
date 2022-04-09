export interface Vehicle {
    vehicle_id?: string;
    user_id?: string;
    year: number;
    manufacturer: string;
    model: string;
    color: string;
    bodystyle: string;
    motor: string;
    motor_type: string;
    transmission: string;
    drivetrain: string;
    interior: string;
    nickname: string;
    purchase_date: Date;
    purchase_price: number;
    purchase_mileage: number;
    sold_date: Date;
    sold_price: number;
    sold_mileage: number;
    vin: string;
}