import React, { useState, useCallback } from "react";
import { View, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { COLLECTION_APPOINTMENTS } from "../../configs/database";

import { Appointment, AppointmentProps } from "../../components/Appointment";
import { CategorySelect } from "../../components/CategorySelect";
import { ListDivider } from "../../components/ListDivider";
import { ListHeader } from "../../components/ListHeader";
import { Background } from '../../components/Background';
import { ButtonAdd } from "../../components/ButtonAdd";
import { Profile } from "../../components/Profile";
import { Load } from "../../components/Load";

import { styles } from "./styles";

export function Home(){
    const navigation = useNavigation();
    
    const [category, setCategory] = useState('');
    const [appointments, setAppoitments] = useState<AppointmentProps[]>([]);
    const [loading, setLoading] = useState(true);

    function handleCategorySelect(categoryId: string) {
        categoryId === category ? setCategory('') : setCategory(categoryId);
    };

    function handleAppointmentDetails(guildSelected: AppointmentProps) {
        navigation.navigate("AppointmentDetails", { guildSelected });
    };

    function handleAppointmentCreate() {
        navigation.navigate("AppointmentCreate");
    };

    async function loadAppointments() {
        const response = await AsyncStorage.getItem(COLLECTION_APPOINTMENTS);

        const storage: AppointmentProps[] = response ? JSON.parse(response) : [];

        if(category) {
            setAppoitments(storage.filter(item => item.category === category));
        } else {
            setAppoitments(storage);
        };

        setLoading(false);
    };

    useFocusEffect(useCallback(() => {
        loadAppointments();
    }, [category]));

    return (
        <Background>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Profile />
                    <ButtonAdd onPress={handleAppointmentCreate} />
                </View>

                <CategorySelect 
                    categorySelected={category}
                    setCategory={handleCategorySelect}
                />
                
                { loading ? <Load /> :
                    <>
                        <ListHeader title="Partidas agendadas" subtitle={`Total ${appointments.length}`}/>
        
                        <FlatList
                            data={appointments}
                            keyExtractor={item => item.id}
                            renderItem={({item}) => (
                                <Appointment 
                                    data={item}
                                    onPress={() => handleAppointmentDetails(item)}    
                                />
                            )}
                            ItemSeparatorComponent={() => <ListDivider />}
                            contentContainerStyle={{paddingBottom: 40}}
                            style={styles.matches}
                            showsVerticalScrollIndicator={false}
                        />
                    </>
                }
            </View>
        </Background>
    );
};