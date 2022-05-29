export interface FuelLog {
    log_id?: string | null,
    purchase_date: string,
    odometer: number,
    gallons: number,
    fuel_cost: string,
    trip?: string,
    octane: {
        id: string,
        name?: string
    },
    brand: {
        id: string,
        name?: string
    },
    station: {
        id?: string | null,
        latitude?: string,
        longitude?: string,
        address?: {
            street: string,
            city: string,
            state: string,
            zip: string
        },
        is_confirmed?: string
    },
    is_partial_fill: string,
    is_ethonal_free: string,
    is_excluded: string
}

export interface FuelLogResponseWrapper {
    data: FuelLog[],
    total_rows: string,
    rows_per_page: number,
    page: number
}
