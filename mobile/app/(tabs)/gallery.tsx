import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, Image, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api, Album, Photo } from '@/lib/api';
import { PhotoGrid } from '@/src/components/PhotoGrid';
import { EmptyState } from '@/src/components/EmptyState';

export default function GalleryScreen() {
  const router = useRouter();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const loadAlbums = async () => {
    try {
      // Load all events to get albums — use first event's albums or aggregate
      const eventsRes = await api.getEvents({ limit: 100 });
      const allAlbums: Album[] = [];
      for (const event of eventsRes.data) {
        try {
          const eventAlbums = await api.getAlbums(event.id);
          allAlbums.push(...eventAlbums);
        } catch {}
      }
      setAlbums(allAlbums);
      if (allAlbums.length > 0 && !selectedAlbumId) {
        setSelectedAlbumId(allAlbums[0].id);
      }
    } catch (err) {
      console.error('Failed to load albums:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadPhotos = async (albumId: string) => {
    setLoadingPhotos(true);
    try {
      const data = await api.getPhotos(albumId);
      setPhotos(data);
    } catch (err) {
      console.error('Failed to load photos:', err);
      setPhotos([]);
    } finally {
      setLoadingPhotos(false);
    }
  };

  useEffect(() => {
    loadAlbums();
  }, []);

  useEffect(() => {
    if (selectedAlbumId) {
      loadPhotos(selectedAlbumId);
    }
  }, [selectedAlbumId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAlbums();
    if (selectedAlbumId) {
      await loadPhotos(selectedAlbumId);
    }
    setRefreshing(false);
  }, [selectedAlbumId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Galeria</Text>
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Galeria</Text>

      {/* Album tabs */}
      {albums.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.albumTabs}
        >
          {albums.map((album) => (
            <TouchableOpacity
              key={album.id}
              style={[styles.albumTab, selectedAlbumId === album.id && styles.albumTabActive]}
              onPress={() => setSelectedAlbumId(album.id)}
            >
              <Text style={[styles.albumTabText, selectedAlbumId === album.id && styles.albumTabTextActive]}>
                {album.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Photo grid or empty */}
      {loadingPhotos ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : photos.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.emptyScroll}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007AFF" />}
        >
          <EmptyState
            icon="image-outline"
            title="Sem fotos"
            message="Ainda não existem fotos neste álbum."
          />
        </ScrollView>
      ) : (
        <FlatList
          data={photos}
          numColumns={3}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.gridRow}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007AFF" />}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectedPhoto(item)} activeOpacity={0.7}>
              <Image source={{ uri: item.thumbnail || item.url }} style={styles.gridImage} resizeMode="cover" />
            </TouchableOpacity>
          )}
        />
      )}

      {/* Fullscreen modal */}
      <Modal visible={!!selectedPhoto} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalClose} onPress={() => setSelectedPhoto(null)}>
            <Ionicons name="close" size={32} color="#fff" />
          </TouchableOpacity>
          {selectedPhoto && (
            <Image source={{ uri: selectedPhoto.url }} style={styles.modalImage} resizeMode="contain" />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  headerTitle: { fontSize: 34, fontWeight: '800', color: '#fff', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 12 },
  loadingCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyScroll: { flexGrow: 1 },
  albumTabs: { paddingHorizontal: 20, paddingBottom: 16, gap: 8 },
  albumTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#2a2a2a' },
  albumTabActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  albumTabText: { fontSize: 14, fontWeight: '600', color: '#888' },
  albumTabTextActive: { color: '#fff' },
  grid: { padding: 3 },
  gridRow: { gap: 3 },
  gridImage: { width: 118, height: 118, borderRadius: 4, backgroundColor: '#1a1a1a' },
  modalOverlay: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  modalClose: { position: 'absolute', top: 60, right: 20, zIndex: 10, width: 44, height: 44, borderRadius: 22, backgroundColor: '#333', alignItems: 'center', justifyContent: 'center' },
  modalImage: { width: '100%', height: '80%' },
});
