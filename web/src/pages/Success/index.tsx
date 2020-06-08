import React from 'react';
import { useHistory } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import { setTimeout } from 'timers';

import './styles.css';
import { ROOT } from '../../constants';

const Success = () => {

    const history = useHistory();
    setTimeout(() => {
        history.push(ROOT);
    }, 3000);

    return (
        <div className="sucess-content">
            <div id="message">
                <span><FiCheckCircle /></span>
                <h1>Cadastro concluído!</h1>
            </div>
        </div>
    );
};

export default Success;