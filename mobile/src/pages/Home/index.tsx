import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons'
import { View, ImageBackground, Image, StyleSheet, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler'; 
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-community/picker';

import { POINTS, UF, FILTER_UF, FILTER_CITY } from '../../constants';
import { City, UF as UF_, IBGECityResponse, IBGEUFResponse } from '../../models/models';
import Ibge from '../../services/ibge';


const Home = () => {
    const navigation = useNavigation();

    const [cities, setCities] = useState<City[]>([]);
    const [ufs, setUfs] = useState<UF_[]>([]);
    const [selectedUf, setSelectedUf] = useState<string>('default');
    const [selectedCity, setSelectedCity] = useState<string>('default');

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

        Ibge.get<IBGECityResponse[]>(`${UF}/${selectedUf}${FILTER_CITY}`)
            .then(response =>{
                const serializedCities = response.data.map(city => {
                    return {
                        id: city.id,
                        name: city.nome,
                    }
                });

            setCities(serializedCities);
        });
    }, [selectedUf]);

    function handleNavigationPoints() {
        navigation.navigate(POINTS, { city: selectedCity, uf: selectedUf });
    }  

    return (
        <ImageBackground 
            source={require('../../assets/home-background.png')} 
            style={styles.container}
            imageStyle={{ width: 274, height: 368 }}>
            <View style={styles.main}>
                <Image source={require('../../assets/logo.png')}/>
                <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>            
            </View>

            <View>
                <View style={styles.pickerView}>
                    <Picker style={styles.picker}
                        selectedValue={selectedUf}
                        mode='dropdown'
                        onValueChange ={ (uf) => setSelectedUf(String(uf)) }>
                        <Picker.Item label="Selecione um estado" value="default" />
                        {ufs.map(uf => (
                            <Picker.Item key={uf.id} label={`${uf.name} (${uf.abbv})`} value={uf.abbv} />
                        ))}
                    </Picker>
                </View>

                <View style={styles.pickerView}>
                    <Picker style={styles.picker}
                        selectedValue={selectedCity}
                        mode='dropdown'
                        onValueChange ={ (city) => setSelectedCity(String(city)) }>
                        <Picker.Item label="Selecione uma cidade" value="default" />
                        {cities.map(city => (
                            <Picker.Item key={city.id} label={city.name} value={city.name} />
                        ))}
                    </Picker>
                </View>
                <RectButton style={styles.button} onPress={handleNavigationPoints}>
                    <View style={styles.buttonIcon}>
                        <Icon name="arrow-right" color="#FFF" size={24}/>
                    </View>
                    <Text style={styles.buttonText}>Entrar</Text>
                </RectButton>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
        backgroundColor: '#f0f0f5',
    },

    main: {
        flex: 1,
        justifyContent: 'center',
    },

    title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 64,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
    },

    pickerView: {
        borderRadius: 10, 
        borderWidth: 1, 
        borderColor: '#FFF', 
        overflow: 'hidden',
        marginTop: 4,
    },

    picker: {
        flex: 1,
        justifyContent: "center",
        padding: 32,
        borderRadius: 16,
        backgroundColor: "#FFF",
        fontFamily: 'Roboto',
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: 14,
        lineHeight: 16,
        color: "#A0A0B2"
    },

    input: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },

    button: {
        backgroundColor: '#34CB79',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 16,
    },

    buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    }
});

export default Home;