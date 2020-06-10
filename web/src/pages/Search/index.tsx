import React, { useEffect, useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import Api from '../../services/api';
import Ibge from '../../services/ibge';
import { 
    Item, 
    City, 
    UF as UF_, 
    IBGECityResponse, 
    IBGEUFResponse, 
    Point 
} from '../../models/models';

import { ROOT, ITEMS, FILTER_UF, FILTER_CITY, UF, POINTS } from '../../constants';
import logo from '../../assets/logo.svg';
import './styles.css';

const Search = () => {

    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<UF_[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [points, setPoints] = useState<Point[]>([]);

    const [selectedUf, setSelectedUf] = useState<string>('default');
    const [selectedCity, setSelectedCity] = useState<string>('default');
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

    useEffect( () => {
        Api.get(ITEMS).then(response => {
            setItems(response.data);
        });
    }, []);

    useEffect( () => {
        Ibge.get<IBGEUFResponse[]>(FILTER_UF).then(response =>{
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

        Ibge.get<IBGECityResponse[]>(`${UF}/${selectedUf}${FILTER_CITY}`).then(response =>{
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
        Api.get(POINTS, {
            params: {
                uf: selectedUf !== 'default' ? selectedUf : undefined,
                city: selectedCity !== 'default' ? selectedCity : undefined,
                items: selectedItems.size > 0 ? Array.from(selectedItems) : undefined,
            }
        }).then(response => {
            setPoints(response.data);
        });
    }, [selectedUf, selectedCity, selectedItems]);

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        const value = event.target.value;
        setSelectedUf(value);
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        const value = event.target.value;
        setSelectedCity(value);
    }

    function handleSelectItem(id: number) {
        const newItems = new Set(selectedItems);
        if(newItems.has(id))
            newItems.delete(id);
        else
            newItems.add(id);
        setSelectedItems(newItems);
    }

    return (
        <div id="page-search">
            <div className="content">
                <header>
                    <img src={logo} alt="Ecoleta"/>
                    <Link to={ROOT}>
                        <FiArrowLeft/>
                        Voltar para home
                    </Link>
                </header>
                <main>
                    <form>
                        <div className="field-group">
                            <div className="field">
                                <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
                                    <option value="default">Selecione uma UF</option>
                                    { ufs.map(uf =>(
                                        <option key={uf.id} value={uf.abbv}>{uf.name} ({uf.abbv})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="field">
                                <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                                    <option value="default">Selecione uma cidade</option>
                                    { cities.map(city =>(
                                        <option key={city.id} value={city.name}>{city.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <ul className="items-grid">
                            {items.map(item => (
                                <li key={item.id}
                                    onClick={() => handleSelectItem(item.id)}
                                    className={selectedItems.has(item.id) ? 'selected' : ''}>
                                    <img src={`${process.env.REACT_APP_SERVER}${item.image_url}`} 
                                        alt={item.name}/>
                                    <span>{item.name}</span>
                                </li>
                            ))}
                        </ul>
                    </form>
                    {points.length > 1 && (
                        <span>
                            <strong> {points.length} pontos </strong> encontrados
                        </span>
                    )}
                    {points.length === 1 && (
                        <span>
                            <strong> 1 ponto </strong> encontrado
                        </span>
                    )}
                    <ul className="points-grid">
                        {points.map(point => (
                            <li key={point.id}>
                                <img src={`${process.env.REACT_APP_SERVER}${point.image_url}`} alt={point.image}/>
                                <span className="title">{point.name}</span>
                                <span className="items">{point.items.join(', ')}</span>
                                <p>{point.city}, {point.uf}</p>
                            </li>
                        ))}
                    </ul>
                </main>
            </div>
            <div id="background"/>
        </div>
    );
};

export default Search;