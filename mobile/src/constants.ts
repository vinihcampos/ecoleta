// Application paths
export const API_SERVER = 'http://192.168.0.113:3333';
export const API_IBGE = 'https://servicodados.ibge.gov.br/api/v1/localidades';
export const ROOT = '/';
export const CREATE_POINT = '/create';
export const SEARCH_POINT = '/search';
export const SUCCESS = '/success';
export const ITEMS = 'items';
export const UF = 'estados';
export const POINTS = 'points';
export const HOME = 'home';
export const DETAIL = 'detail';
export const FILTER_UF = `${UF}?orderBy=nome`;
export const FILTER_CITY='/municipios?orderBy=nome';
export const DEFAULT_POSITION : [number, number] = [-23.59296,-46.6223104];