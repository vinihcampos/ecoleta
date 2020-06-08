import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import Home from './pages/Home';
import CreatePoint from './pages/CreatePoint';
import { ROOT, CREATE_POINT } from './constants';

const Routes = () => {
    return (
        <BrowserRouter>
            <Route component={Home} path={ROOT} exact/>
            <Route component={CreatePoint} path={CREATE_POINT}/>
        </BrowserRouter>
    );
}

export default Routes;
