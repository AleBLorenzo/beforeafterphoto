import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importamos tus pantallas
import BeforeAfterDetail from './src/screens/BeforeAfterDetail';
import { CameraBeforeCapture } from './src/screens/CameraBeforeCapture'; // ← Añadir llaves {}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="BeforeAfterDetail">
        <Stack.Screen 
          name="BeforeAfterDetail" 
          component={BeforeAfterDetail} 
          options={{ title: 'Mis Proyectos Antes/Después' }}
        />
        <Stack.Screen 
          name="CameraBeforeCapture" 
          component={CameraBeforeCapture} 
          options={{ title: 'Captura "ANTES"', headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}