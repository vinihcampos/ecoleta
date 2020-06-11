import React from 'react';
import { NavigationContainer, Route } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './pages/Home';
import Points from './pages/Points';
import Detail from './pages/Detail';
import {HOME, POINTS, DETAIL} from './constants';

const AppStack = createStackNavigator();

const Routes = () => {
    return (
        <NavigationContainer>
            <AppStack.Navigator 
                headerMode="none" 
                screenOptions={{
                    cardStyle:{
                        backgroundColor: '#f0f0f5'
                    }
                }}>
                <AppStack.Screen name={HOME} component={Home}/>
                <AppStack.Screen name={POINTS} component={Points}/>
                <AppStack.Screen name={DETAIL} component={Detail}/>
            </AppStack.Navigator>
        </NavigationContainer>
    );
};

export default Routes;
