import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, RefreshControl, Image, Platform, Dimensions, LayoutAnimation, UIManager } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 48) / 3;

interface Photo {
  id: string;
  url: string;
  thumbnail?: string;
  metadata?: {
    isFavorite?: boolean;
    selected?: boolean;
    width?: number;
    height?: number;
  };
}

export default function GalleryScreen({ route }: { route: { params?: { eventId: string; albumId: string } } }) {
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const flatListRef = useRef<FlatList<Photo>>(null);

  const eventId = route.params?.eventId;
  const albumId = route.params?.albumId;

  useEffect(() => {
    if (isAuthenticated) {
      fetchPhotos();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const fetchPhotos = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      let response;
      if (albumId) {
        response = await api.getPhotos(albumId);
      } else if (eventId) {
        // Get photos from all albums in event - would need an endpoint
        response = await api.getPhotos(albumId || '');
      }
      const photoData = response || [];
      setPhotos(photoData);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao carregar fotos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => fetchPhotos(true);

  const toggleFavorite = async (photoId: string) => {
    try {
      await api.recordStat(photoId, 'FAVORITE');
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setPhotos(prev => prev.map(p => 
        p.id === photoId ? { ...p, metadata: { ...p.metadata, isFavorite: !p.metadata?.isFavorite } } : p
      ));
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao favoritar');
    }
  };

  const toggleSelection = (photoId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(photoId)) {
        next.delete(photoId);
      } else {
        next.add(photoId);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === photos.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(photos.map(p => p.id)));
    }
  };

  const handleDownload = async () => {
    Alert.alert('Download', `Download de ${selectedIds.size} fotos iniciado`);
    setSelectionMode(false);
    setSelectedIds(new Set());
  };

  const handleShare = () => {
    Alert.alert('Partilhar', `Partilhar ${selectedIds.size} fotos`);
    setSelectionMode(false);
    setSelectedIds(new Set());
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: Photo }) => {
    const isFavorite = item.metadata?.isFavorite;
    const isSelected = selectedIds.has(item.id);
    const imageUrl = item.thumbnail || item.url;

    return (
      <TouchableOpacity
        style={[styles.photoContainer, selectionMode && styles.photoContainerSelectable]}
        onPress={() => {
          if (selectionMode) {
            toggleSelection(item.id);
          } else {
            router.push(`/gallery/photo/${item.id}`);
          }
        }}
        onLongPress={() => {
          if (!selectionMode) {
            setSelectionMode(true);
            setSelectedIds(new Set([item.id]));
          }
        }}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.photoImage}
          resizeMode="cover"
        />
        {isFavorite && (
          <View style={styles.favoriteBadge}>
            <Ionicons name="heart" size={16} color="#fff" />
          </View>
        )}
        {selectionMode && (
          <View style={styles.selectionOverlay}>
            <View style={[styles.selectionCheck, isSelected && styles.selectionCheckSelected]}>
              {isSelected && <Ionicons name="checkmark" size={20} color="#fff" />}
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {selectionMode ? (
            <TouchableOpacity onPress={() => { setSelectionMode(false); setSelectedIds(new Set()); }} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>{albumId ? 'Álbum' : 'Galeria'}</Text>
        </View>
        <View style={styles.headerRight}>
          {!selectionMode && photos.length > 0 && (
            <TouchableOpacity onPress={() => { setSelectionMode(true); setSelectedIds(new Set(photos.map(p => p.id))); }} style={styles.actionButton}>
              <Ionicons name="checkbox-outline" size={24} color="#fff" />
            </TouchableOpacity>
          )}
          {selectionMode && (
            <>
              <TouchableOpacity onPress={handleSelectAll} style={styles.actionButton}>
                <Text style={styles.selectAllText}>{selectedIds.size === photos.length ? 'Desmarcar' : 'Selecionar'} Tudo</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDownload} style={[styles.actionButton, styles.primaryButton]}>
                <Ionicons name="download-outline" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
                <Ionicons name="share-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={photos}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={3}
        columnWrapperStyle={styles.gridWrapper}
        contentContainerStyle={styles.gridContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3b82f6']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="images-outline" size={64} color="#9ca3af" />
            <Text style={styles.emptyTitle}>Nenhuma foto</Text>
            <Text style={styles.emptySubtitle}>Adicione fotos a este álbum</Text>
          </View>
        }
      />
    </View>
  );
}