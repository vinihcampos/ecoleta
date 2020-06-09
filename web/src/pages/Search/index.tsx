import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { ROOT } from '../../constants';

import logo from '../../assets/logo.svg';
import card_img from '../../assets/loggi-tower.jpg';
import './styles.css';


const Search = () => {
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
                                <label htmlFor="uf">UF</label>
                                <select name="uf" id="uf">
                                    <option value="default">Selecione uma UF</option>
                                    {/* ufs.map(uf =>(
                                        <option key={uf.id} value={uf.abbv}>{uf.name} ({uf.abbv})</option>
                                    ))*/}
                                </select>
                            </div>
                            <div className="field">
                                <label htmlFor="city">Cidade</label>
                                <select name="city" id="city">
                                    <option value="default">Selecione uma cidade</option>
                                    {/* cities.map(city =>(
                                        <option key={city.id} value={city.name}>{city.name}</option>
                                    ))*/}
                                </select>
                            </div>
                        </div>
                    </form>
                    <span><strong>2 pontos</strong> encontrados</span>
                    <ul className="items-grid">
                        <li>
                            <img src={card_img} alt="Image"/>
                            <text className="title">Loggi Tower</text>
                            <text className="items">Resíduos Eletrônicos, Lâmpadas, Óleo</text>
                            <p> São Paulo, SP</p>
                        </li>
                        <li>
                            <img src={card_img} alt="Image"/>
                            <text className="title">Loggi Tower</text>
                            <text className="items">Resíduos Eletrônicos, Lâmpadas, Óleo</text>
                            <p> São Paulo, SP</p>
                        </li>
                        <li>
                            <img src={card_img} alt="Image"/>
                            <text className="title">Loggi Tower</text>
                            <text className="items">Resíduos Eletrônicos, Lâmpadas, Óleo</text>
                            <p> São Paulo, SP</p>
                        </li>
                    </ul>
                </main>
            </div>
            <div id="background"/>
        </div>
    );
};

export default Search;