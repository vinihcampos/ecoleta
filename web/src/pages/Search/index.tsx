import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { ROOT } from '../../constants';

import logo from '../../assets/logo.svg';
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
                    <h1>Filtro</h1>
                </main>
            </div>
        </div>
    );
};

export default Search;