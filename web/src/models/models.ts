import React from  'react';

export interface Item {
    id: number;
    name: string;
    image_url: string;
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

export interface Point {
    id: number;
    name: string;
    image: string;
    image_url: string;
    latitude: number;
    longitude: number;
    city: string;
    uf: string;
    items: string[];
}