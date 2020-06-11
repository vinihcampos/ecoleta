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
    city: string;
    uf: string;
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

export interface UF {
    id: number;
    name: string;
    abbv: string;
}

export interface City {
    id: number;
    name: string;
}

export interface IBGEUFResponse {
    id: number;
    nome: string;
    sigla: string;
}

export interface IBGECityResponse {
    id: number;
    nome: string;
}