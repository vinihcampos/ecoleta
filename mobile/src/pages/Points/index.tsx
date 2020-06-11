import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native'
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import * as Location from 'expo-location';

import api from '../../services/api';
import { Item, Point, Params } from '../../models/models';
import { DEFAULT_POSITION, ITEMS, POINTS, DETAIL, API_SERVER } from '../../constants';

const Points = () => {

    const route = useRoute();
    const routeParams = route.params as Params;

    const navigation = useNavigation();
    const [items, setItems] = useState<Item[]>([]);
    const [points, setPoints] = useState<Point[]>([]);
    const [initialPosition, setInitialPosition] = useState<[number,number]>(DEFAULT_POSITION);

    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

    useEffect(() => {
        async function loadPosition () {
            const { status } = await Location.requestPermissionsAsync();
            if(status !== 'granted'){
                Alert.alert('Oooooops...', 'Precisamos de sua permissão para obter a localização');
                return;
            }

            const location = await Location.getCurrentPositionAsync();
            const {latitude, longitude} = location.coords;

            setInitialPosition([latitude, longitude]);
        }

        loadPosition();
    })

    useEffect(() => {
        api.get(ITEMS).then(response => {
            setItems(response.data);
        });
    }, []);

    useEffect( () => {
        api.get(POINTS, {
            params: {
                uf: routeParams.uf !== 'default' ? routeParams.uf : undefined,
                city: routeParams.city !== 'default' ? routeParams.city : undefined,
                items: selectedItems.size > 0 ? Array.from(selectedItems) : undefined,
            }
        }).then(response => {
            setPoints(response.data);
        });
    }, [selectedItems]);

    function handleNavigateBack() {
        navigation.goBack();
    }

    function handleNavigateToDetail(id: number) {
        navigation.navigate(DETAIL, {point_id: id});
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
        <>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon name="arrow-left" size={20} color="#34cb79"/>
                </TouchableOpacity>

                <Text style={styles.title}>Bem vindo</Text>
                <Text style={styles.description}>Encontre um ponto de coleta.</Text>

                <View style={styles.mapContainer}>
                    {initialPosition[0] !== DEFAULT_POSITION[0] && (
                        <MapView 
                            style={styles.map}
                            initialRegion={{
                                latitude: initialPosition[0],
                                longitude: initialPosition[1],
                                latitudeDelta: 0.014,
                                longitudeDelta: 0.014,
                            }}>
                            {points.map(point => (
                                <Marker 
                                    key={point.id}
                                    style={styles.mapMarker}
                                    onPress={() => handleNavigateToDetail(point.id)}
                                    coordinate={{
                                        latitude: point.latitude ,
                                        longitude: point.longitude,
                                    }}>
                                    <View style={styles.mapMarkerContainer}>
                                        <Image 
                                            style={styles.mapMarkerImage} 
                                            source={{ uri: `${API_SERVER}${point.image_url}` }}/>
                                        <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                                    </View>
                                </Marker>
                            ))}
                        </MapView>
                    )}
                </View>
            </View>
            <View style={styles.itemsContainer}>
                <ScrollView 
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{paddingHorizontal:20}}>
                    {items.map(item => (
                        <TouchableOpacity 
                            key={item.id} 
                            style={[
                                styles.item,
                                selectedItems.has(item.id) ? styles.selectedItem : {}
                            ]} 
                            activeOpacity={0.5} 
                            onPress={() => handleSelectItem(item.id)}>
                            <SvgUri 
                                width={42}
                                height={42} 
                                uri={`${API_SERVER}${item.image_url}`}/>
                            <Text style={styles.itemTitle}>{item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 32,
        paddingTop: 20 + Constants.statusBarHeight,
    },

    title: {
        fontSize: 20,
        fontFamily: 'Ubuntu_700Bold',
        marginTop: 24,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 4,
        fontFamily: 'Roboto_400Regular',
    },

    mapContainer: {
        flex: 1,
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 16,
    },

    map: {
        width: '100%',
        height: '100%',
    },

    mapMarker: {
        width: 90,
        height: 80, 
    },

    mapMarkerContainer: {
        width: 90,
        height: 70,
        backgroundColor: '#34CB79',
        flexDirection: 'column',
        borderRadius: 8,
        overflow: 'hidden',
        alignItems: 'center'
    },

    mapMarkerImage: {
        width: 90,
        height: 45,
        resizeMode: 'cover',
    },

    mapMarkerTitle: {
        flex: 1,
        fontFamily: 'Roboto_400Regular',
        color: '#FFF',
        fontSize: 13,
        lineHeight: 23,
    },

    itemsContainer: {
        flexDirection: 'row',
        marginTop: 16,
        marginBottom: 32,
    },

    item: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#eee',
        height: 120,
        width: 120,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 16,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'space-between',

        textAlign: 'center',
    },

    selectedItem: {
        borderColor: '#34CB79',
        borderWidth: 2,
    },

    itemTitle: {
        fontFamily: 'Roboto_400Regular',
        textAlign: 'center',
        fontSize: 13,
    },
});

export default Points;