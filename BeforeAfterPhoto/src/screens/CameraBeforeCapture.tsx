import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Text } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import Geolocation from '@react-native-community/geolocation';
import { StorageService } from '../services/StorageService';
import { CaptureStatus, GPS_ACCURACY_THRESHOLD } from '../models/BeforeAfterRecord';
import { GPSStatus } from '../components/GPSStatus';

export const CameraBeforeCapture = ({ navigation }: any) => {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const camera = useRef<Camera>(null);
  
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [currentPos, setCurrentPos] = useState<any>(null);
  const [gpsStatus, setGpsStatus] = useState<string>('Buscando GPS...');

  useEffect(() => {
    requestPermission();
    
    // 1. Primero intenta obtener la última posición conocida (rápido)
    Geolocation.getCurrentPosition(
      (pos) => {
        setAccuracy(pos.coords.accuracy);
        setCurrentPos(pos.coords);
        updateGpsStatus(pos.coords.accuracy);
      },
      (err) => {
        console.warn('Error GPS inicial:', err);
        setGpsStatus('Buscando satélites GPS...');
      },
      { 
        enableHighAccuracy: true,
        timeout: 5000, // 5 segundos máximo
        maximumAge: 10000 // Acepta posiciones de hasta 10s de antigüedad
      }
    );

    // 2. Luego escucha cambios continuos
    const watchId = Geolocation.watchPosition(
      (pos) => {
        setAccuracy(pos.coords.accuracy);
        setCurrentPos(pos.coords);
        updateGpsStatus(pos.coords.accuracy);
      },
      (err) => console.warn('Error GPS watch:', err),
      { 
        enableHighAccuracy: true, 
        distanceFilter: 5, // Actualiza cada 5 metros
        interval: 1000, // Verifica cada segundo
        fastestInterval: 500
      }
    );
    
    return () => Geolocation.clearWatch(watchId);
  }, []);

  const updateGpsStatus = (acc: number) => {
    if (acc <= GPS_ACCURACY_THRESHOLD) {
      setGpsStatus(`GPS OK (±${acc.toFixed(0)}m)`);
    } else if (acc <= 30) {
      setGpsStatus(`Mejorando señal... (±${acc.toFixed(0)}m)`);
    } else {
      setGpsStatus(`Señal débil (±${acc.toFixed(0)}m)`);
    }
  };

  const handleCapture = async () => {
    if (!accuracy || accuracy > GPS_ACCURACY_THRESHOLD) {
      Alert.alert(
        "Señal GPS Insuficiente", 
        `Precisión actual: ±${accuracy?.toFixed(0) || '?'}m\nRequerida: ±${GPS_ACCURACY_THRESHOLD}m\n\nIntenta salir al exterior o acércate a una ventana.`
      );
      return;
    }

    if (camera.current) {
      try {
        const photo = await camera.current.takePhoto({
          flash: 'off'
        });
        
        const record = {
          id: `rec_${Date.now()}`,
          status: CaptureStatus.PENDING_AFTER,
          photoUri: `file://${photo.path}`,
          previewThumbnailUri: `file://${photo.path}`,
          timestamp: Date.now(),
          gps: {
            lat: currentPos.latitude,
            lon: currentPos.longitude,
            accuracy: accuracy
          },
          heading: 0, 
          pitch: 0, 
          roll: 0,
          camera: { zoom: 1, mode: 'guided' as 'guided' }
        };

        await StorageService.saveBeforeRecord(record);
        Alert.alert("✅ Foto ANTES guardada", "Ahora captura la foto DESPUÉS desde la misma ubicación.");
        navigation.goBack();
      } catch (e) {
        Alert.alert("Error", "No se pudo tomar la foto.");
      }
    }
  };

  if (!hasPermission) return <Text style={styles.errorText}>Sin permiso de cámara</Text>;
  if (device == null) return <Text style={styles.errorText}>Cargando cámara...</Text>;

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />
      
      <View style={styles.overlay}>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{gpsStatus}</Text>
          {accuracy && (
            <Text style={styles.accuracyText}>
              {accuracy <= GPS_ACCURACY_THRESHOLD ? '✅' : '⚠️'} 
              {` Precisión: ±${accuracy.toFixed(1)}m`}
            </Text>
          )}
        </View>
        
        <View style={styles.controls}>
          <TouchableOpacity 
            onPress={handleCapture}
            style={[
              styles.btn, 
              accuracy && accuracy <= GPS_ACCURACY_THRESHOLD ? styles.btnActive : styles.btnDisabled
            ]}
            disabled={!accuracy || accuracy > GPS_ACCURACY_THRESHOLD}
          />
          <Text style={styles.helpText}>
            {accuracy && accuracy <= GPS_ACCURACY_THRESHOLD 
              ? 'Toca para capturar' 
              : 'Esperando mejor señal GPS...'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: { 
    position: 'absolute', 
    top: 40, 
    bottom: 40, 
    width: '100%', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20 
  },
  statusContainer: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  statusText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  accuracyText: {
    color: '#fff',
    fontSize: 14
  },
  controls: { alignItems: 'center' },
  btn: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    borderWidth: 6, 
    borderColor: 'white',
    marginBottom: 10
  },
  btnActive: { backgroundColor: '#4CAF50' },
  btnDisabled: { backgroundColor: '#555' },
  helpText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100
  }
});