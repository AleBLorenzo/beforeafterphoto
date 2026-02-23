import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Definimos el umbral aquí también para seguridad
const GPS_ACCURACY_THRESHOLD = 15; 

interface Props {
  accuracy: number | null;
}

// USAMOS EXPORTACIÓN NOMBRADA (esto es lo que busca el import con llaves { })
export const GPSStatus = ({ accuracy }: Props) => {
  const isGoodSignal = accuracy !== null && accuracy <= GPS_ACCURACY_THRESHOLD;

  if (accuracy === null) {
    return (
      <View style={[styles.badge, styles.searching]}>
        <Text style={styles.text}>Buscando GPS...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.badge, isGoodSignal ? styles.good : styles.bad]}>
      <Text style={styles.text}>
        Precisión: {accuracy.toFixed(1)}m 
        {isGoodSignal ? ' (Lista)' : ' (Baja)'}
      </Text>
      {!isGoodSignal && (
        <Text style={styles.warning}>Esperando mejor señal...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.6)', // Fondo oscuro para que se vea sobre la cámara
  },
  good: { borderLeftWidth: 5, borderLeftColor: '#4CAF50' },
  bad: { borderLeftWidth: 5, borderLeftColor: '#F44336' },
  searching: { borderLeftWidth: 5, borderLeftColor: '#FFC107' },
  text: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  warning: { color: '#FFEB3B', fontSize: 11, marginTop: 2, fontWeight: 'bold' }
});