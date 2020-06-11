export interface Item {
    id: number;
    name: string;
    image_url: string;
}

export interface Point {
    id: number;
    name: string;
    image: string;
    image_url: string;
    latitude: number;
    longitude: number;
}

export interface Params {
    point_id: number;
}

export interface Data {
    point: {
        id: number;
        name: string;
        image: string;
        image_url: string;
        latitude: number;
        longitude: number;
        city: string;
        uf: string;
        whatsapp: string;
        email: string;
    };
    items: {
        title:string;
    }[];
}