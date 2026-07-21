import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api, Event, Album } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { EmptyState } from '@/src/components/EmptyState';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-PT', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function EventDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);

  useEffect(() => {
    if (!id) return;
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [eventData, albumsData] = await Promise.all([
        api.getEvent(id!),
        api.getAlbums(id!),
      ]);
      setEvent(eventData);
      setAlbums(albumsData);
    } catch (err) {
      console.error('Failed to load event:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async () => {
    if (!event) return;
    setReserving(true);
    try {
      await api.createReservation(event.id);
      Alert.alert('Sucesso', 'Reserva criada com sucesso!');
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Não foi possível reservar.');
    } finally {
      setReserving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.container}>
        <EmptyState icon="alert-circle-outline" title="Evento não encontrado" />
      </View>
    );
  }

  const canReserve = user?.role === 'CLIENT' && event.isPublic;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.eventName}>{event.name}</Text>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={16} color="#007AFF" />
            <Text style={styles.dateText}>{formatDate(event.date)}</Text>
          </View>
          {event.location && (
            <View style={styles.dateRow}>
              <Ionicons name="location-outline" size={16} color="#007AFF" />
              <Text style={styles.dateText}>{event.location}</Text>
            </View>
          )}
          {event.description && (
            <Text style={styles.description}>{event.description}</Text>
          )}
        </View>

        {/* Albums */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Álbuns</Text>
          {albums.length === 0 ? (
            <EmptyState icon="folder-open-outline" title="Sem álbuns" message="Ainda não existem álbuns neste evento." />
          ) : (
            albums.map((album) => (
              <TouchableOpacity
                key={album.id}
                style={styles.albumCard}
                onPress={() => router.push({ pathname: '/gallery/photo', params: { albumId: album.id } })}
                activeOpacity={0.7}
              >
                <View style={styles.albumIcon}>
                  <Ionicons name="images-outline" size={24} color="#007AFF" />
                </View>
                <View style={styles.albumInfo}>
                  <Text style={styles.albumName}>{album.name}</Text>
                  <Text style={styles.albumCount}>{album._count?.photos ?? 0} fotos</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#555" />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Reserve button */}
      {canReserve && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.reserveBtn, reserving && styles.reserveBtnDisabled]}
            onPress={handleReserve}
            disabled={reserving}
          >
            {reserving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.reserveBtnText}>Reservar</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  loadingCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingBottom: 100 },
  topBar: { paddingTop: 56, paddingHorizontal: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1a1a1a', alignItems: 'center', justifyContent: 'center' },
  hero: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  eventName: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 12 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  dateText: { fontSize: 15, color: '#aaa' },
  description: { fontSize: 15, color: '#888', marginTop: 12, lineHeight: 22 },
  section: { paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 16 },
  albumCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a',
    borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#2a2a2a',
  },
  albumIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#007AFF22', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  albumInfo: { flex: 1 },
  albumName: { fontSize: 16, fontWeight: '600', color: '#fff' },
  albumCount: { fontSize: 13, color: '#888', marginTop: 2 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 40, backgroundColor: '#000', borderTopWidth: 1, borderTopColor: '#1a1a1a' },
  reserveBtn: { backgroundColor: '#007AFF', borderRadius: 14, paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  reserveBtnDisabled: { backgroundColor: '#007AFF80' },
  reserveBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
