import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import {Map, TileLayer, Marker} from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import api from '../../services/api';
import ibge from '../../services/ibge';

import './styles.css';
import logo from '../../assets/logo.svg';
import Dropzone from '../../components/Dropzone';
import { ROOT, ITEMS, FILTER_UF, UF, FILTER_CITY } from '../../constants';

interface Item {
    id: number;
    name: string;
    image_url: string;
}

interface UF {
    id: number;
    name: string;
    abbv: string;
}

interface City {
    id: number;
    name: string;
}

interface IBGEUFResponse {
    id: number;
    nome: string;
    sigla: string;
}

interface IBGECityResponse {
    id: number;
    nome: string;
}

const CreatePoint = () => {

    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<UF[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [initialPosition, setInitialPosition] = useState<[number,number]>([0,0]);

    const [selectedUf, setSelectedUf] = useState('default');
    const [selectedCity, setSelectedCity] = useState('default');
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [selectedPosition, setSelectedPosition] = useState<[number,number]>([0,0]);
    const [selectedFile, setSelectedFile] = useState<File>();
    const [inputForm, setInputForm] = useState({
        name: '',
        email: '',
        whatsapp: ''
    });
    
    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        const value = event.target.value;
        setSelectedUf(value);
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        const value = event.target.value;
        setSelectedCity(value);
    }

    function handleMapClick(event: LeafletMouseEvent) {
        const lat_lng = event.latlng;
        setSelectedPosition([lat_lng.lat, lat_lng.lng]);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const {name, value} = event.target;
        setInputForm({...inputForm, [name]: value});
    }

    function handleSelectItem(id: number) {
        const newItems = new Set(selectedItems);
        if(newItems.has(id))
            newItems.delete(id);
        else
            newItems.add(id);
        setSelectedItems(newItems);
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        
        const {name, email, whatsapp} = inputForm;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude,longitude] = selectedPosition;
        const items = selectedItems;

        const data = new FormData();
        
        data.append('name', name); 
        data.append('email', email); 
        data.append('whatsapp', whatsapp);
        data.append('uf', uf); 
        data.append('city', city); 
        data.append('latitude', String(latitude)); 
        data.append('longitude', String(longitude)); 
        data.append('items', Array.from(items).join(','));
        if(selectedFile)
            data.append('image', selectedFile);

        const response = await api.post('points', data);

        if(response.status === 200){
            alert('Ponto de coleta criado com sucesso!');
            history.push(ROOT);
            return;
        }

        alert('Não foi possível criar um ponto de coleta!');
    }

    const history = useHistory();

    useEffect(() => {
        api.get(ITEMS).then(response => {
            setItems(response.data);
            console.log(response.data);
        });
    }, []);

    useEffect( () => {
        ibge.get<IBGEUFResponse[]>(FILTER_UF).then(response =>{
            const serializedUF = response.data.map(uf => {
                return {
                    id: uf.id,
                    name: uf.nome,
                    abbv: uf.sigla
                }
            });

            setUfs(serializedUF);
        });
    }, [] );

    useEffect( () => {
        if(selectedUf === 'default') {
            setCities([]);
            return;
        }

        ibge.get<IBGECityResponse[]>(`${UF}/${selectedUf}${FILTER_CITY}`).then(response =>{
            const serializedCities = response.data.map(city => {
                return {
                    id: city.id,
                    name: city.nome,
                }
            });

            setCities(serializedCities);
        });
    }, [selectedUf]);
    
    useEffect( () => {
        navigator.geolocation.getCurrentPosition( position => {
            setInitialPosition([
                position.coords.latitude, position.coords.longitude
            ]);
        });
    }, [] );

    return(
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>

                <Link to={ROOT}>
                    <FiArrowLeft/>
                    Voltar para home
                </Link>
            </header>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br/>ponto de coleta</h1>

                <Dropzone onFileUploaded={setSelectedFile}/>

                <fieldset>
                    <legend><h2>Dados da entidade</h2></legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input type="text" name="name" id="name" onChange={handleInputChange}/>
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input type="email" name="email" id="email" onChange={handleInputChange}/>
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input type="text" name="whatsapp" id="whatsapp" onChange={handleInputChange}/>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço do mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                        
                        <Marker position={selectedPosition}/>
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">UF</label>
                            <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
                                <option value="default">Selecione uma UF</option>
                                { ufs.map(uf =>(
                                    <option key={uf.id} value={uf.abbv}>{uf.name} ({uf.abbv})</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                                <option value="default">Selecione uma cidade</option>
                                { cities.map(city =>(
                                    <option key={city.id} value={city.name}>{city.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Itens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        { items.map(item => (
                            <li key={item.id} 
                                onClick={() => handleSelectItem(item.id)}
                                className={selectedItems.has(item.id) ? 'selected' : ''}>
                                <img 
                                    src={`${process.env.REACT_APP_SERVER}${item.image_url}`} 
                                    alt={item.name}/>
                                <span>{item.name}</span>
                            </li>
                        ))}                        
                    </ul>
                </fieldset>
                <button type="submit">Cadastrar ponto de coleta</button>
            </form>
        </div>
    );
}

export default CreatePoint;