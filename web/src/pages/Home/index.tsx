import React from 'react';
import { FiLogIn, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import './styles.css'
import logo from '../../assets/logo.svg';
import { CREATE_POINT, SEARCH_POINT } from '../../constants';

const Home = () => {
    return (
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt="Ecoleta"/>
                </header>
                <main>
                    <h1>Seu marketplace de coleta de resíduos.</h1>
                    <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>

                    <Link to={ CREATE_POINT }>
                        <span><FiLogIn/></span>
                        <strong>Cadastre um ponto de coleta</strong>
                    </Link>
                    <Link to={ SEARCH_POINT }>
                        <span><FiSearch/></span>
                        <strong>Pesquisar pontos de coleta</strong>
                    </Link>
                </main>
            </div>
        </div>
    );
}

export default Home;