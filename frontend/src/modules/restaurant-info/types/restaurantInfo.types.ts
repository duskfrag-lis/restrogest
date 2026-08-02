export interface RestaurantSchedule {

    [day: string]: string
}

export interface RestaurantSocialLinks {

    [platform: string]: string
}

export interface RestaurantInfo {

    id: string
    name: string
    description: string | null
    address: string | null
    phone: string | null
    email: string | null
    schedule: RestaurantSchedule | null
    social_links: RestaurantSocialLinks | null
    updated_at: string
}

