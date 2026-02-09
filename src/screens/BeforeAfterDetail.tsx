import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { StorageService } from '../services/StorageService';
import { BeforeAfterRecord, CaptureStatus } from '../models/BeforeAfterRecord';

const BeforeAfterDetail = ({ navigation }: any) => {
  const [records, setRecords] = useState<BeforeAfterRecord[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadRecords = async () => {
    const data = await StorageService.getAllRecords();
    // Ordenar por más reciente primero
    setRecords(data.sort((a, b) => b.timestamp - a.timestamp));
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadRecords);
    return unsubscribe;
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecords();
    setRefreshing(false);
  };

  const handleRecordPress = (record: BeforeAfterRecord) => {
    if (record.status === CaptureStatus.PENDING_AFTER) {
      Alert.alert(
        'Capturar foto DESPUÉS',
        '¿Ir a la cámara para capturar la foto DESPUÉS?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Capturar',
            onPress: () =>
              navigation.navigate('CameraAfterCapture', { recordId: record.id }),
          },
        ]
      );
    } else if (record.status === CaptureStatus.COMPLETE) {
      // TODO: Mostrar vista de comparación
      Alert.alert('Comparación', 'Vista de comparación (próximamente)');
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Eliminar registro', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await StorageService.deleteRecord(id);
          loadRecords();
        },
      },
    ]);
  };

  const getStatusColor = (status: CaptureStatus) => {
    switch (status) {
      case CaptureStatus.PENDING_AFTER:
        return '#FF9800'; // Naranja
      case CaptureStatus.COMPLETE:
        return '#4CAF50'; // Verde
      default:
        return '#9E9E9E'; // Gris
    }
  };

  const getStatusText = (status: CaptureStatus) => {
    switch (status) {
      case CaptureStatus.PENDING_AFTER:
        return 'Falta foto DESPUÉS';
      case CaptureStatus.COMPLETE:
        return 'Completo';
      default:
        return 'Pendiente';
    }
  };

  const renderItem = ({ item }: { item: BeforeAfterRecord }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleRecordPress(item)}
      onLongPress={() => handleDelete(item.id)}
    >
      <Image source={{ uri: item.photoUri }} style={styles.thumb} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>
            {new Date(item.timestamp).toLocaleDateString()}
          </Text>
          <View
            style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}
          >
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>
        <Text style={styles.cardSubtitle}>
          {new Date(item.timestamp).toLocaleTimeString()}
        </Text>
        <Text style={styles.cardMeta}>
          📍 Precisión: ±{item.gps.accuracy.toFixed(1)}m
        </Text>
        {item.status === CaptureStatus.COMPLETE && item.isValid !== undefined && (
          <Text style={[styles.validation, item.isValid ? styles.valid : styles.invalid]}>
            {item.isValid ? '✅ Validación OK' : '⚠️ Validación fallida'}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Proyectos Antes/Después</Text>
        <Text style={styles.subtitle}>
          {records.length} {records.length === 1 ? 'registro' : 'registros'}
        </Text>
      </View>

      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>📸</Text>
            <Text style={styles.emptyTitle}>No hay capturas aún</Text>
            <Text style={styles.emptySubtitle}>
              Toca el botón de abajo para empezar
            </Text>
          </View>
        }
        contentContainerStyle={records.length === 0 && styles.emptyList}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CameraBeforeCapture')}
      >
        <Text style={styles.fabText}>+ NUEVA CAPTURA</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumb: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  cardMeta: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  validation: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  valid: {
    color: '#4CAF50',
  },
  invalid: {
    color: '#F44336',
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  fabText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BeforeAfterDetail;