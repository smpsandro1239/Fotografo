import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView, Alert, Image, Modal, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import { api, Photo } from '@/lib/api';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 48) / 3;

export default function GalleryScreen({ route }: any) {
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [albumId, setAlbumId] = useState(route.params?.albumId);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    if (isAuthenticated && albumId) {
      fetchPhotos();
    }
  }, [isAuthenticated, albumId]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const fetchPhotos = async () => {
    if (!albumId) return;
    try {
      const data = await api.getPhotos(albumId);
      setPhotos(data);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao carregar fotos');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoPress = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const handleFavorite = async (photo: Photo) => {
    try {
      await api.recordStat(photo.id, 'favorite');
      // Update local state
      setPhotos(prev => prev.map(p => 
        p.id === photo.id ? { ...p, isFavorite: !p.isFavorite } : p
      ));
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao favoritar');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Galeria</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={photos}
        numColumns={3}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.photoItem, { width: ITEM_SIZE, height: ITEM_SIZE }]}
            onPress={() => handlePhotoPress(item)}
          >
            <Image
              source={{ uri: item.thumbnail || item.url }}
              style={styles.photoImage}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={[styles.favoriteBtn, item.isFavorite && styles.favoriteBtnActive]}
              onPress={(e) => { e.stopPropagation(); handleFavorite(item); }}
            >
              <Ionicons
                name={item.isFavorite ? 'heart' : 'heart-outline'}
                size={20}
                color={item.isFavorite ? '#ef4444' : '#fff'}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.gridContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="images-outline" size={64} color="#9ca3af" />
            <Text style={styles.emptyTitle}>Nenhuma foto</Text>
            <Text style={styles.emptySubtitle}>Adicione fotos a este álbum</Text>
          </View>
        }
      />

      {selectedPhoto && (
        <Modal
          visible={!!selectedPhoto}
          animationType="fade"
          onRequestClose={() => setSelectedPhoto(null)}
        >
          <View style={styles.fullscreenContainer}>
            <Image
              source={{ uri: selectedPhoto.url }}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.closeFullscreenBtn}
              onPress={() => setSelectedPhoto(null)}
            >
              <Ionicons name="close" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}