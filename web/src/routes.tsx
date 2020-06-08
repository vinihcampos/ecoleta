import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import Home from './pages/Home';
import CreatePoint from './pages/CreatePoint';
import Search from './pages/Search';
import Success from './pages/Success';
import { ROOT, CREATE_POINT, SUCCESS, SEARCH_POINT } from './constants';

const Routes = () => {
    return (
        <BrowserRouter>
            <Route component={Home} path={ROOT} exact/>
            <Route component={CreatePoint} path={CREATE_POINT}/>
            <Route component={Search} path={SEARCH_POINT}/>
            <Route component={Success} path={SUCCESS}/>
        </BrowserRouter>
    );
}

export default Routes;
