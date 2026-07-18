import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { useRouter, useRoute } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

interface Event {
  id: string;
  name: string;
  description?: string;
  date: string;
  location?: string;
  isPublic: boolean;
  albums: Array<{
    id: string;
    name: string;
    _count: { photos: number };
  }>;
  photographer?: {
    user: { name?: string; email: string };
  };
}

export default function EventDetailScreen() {
  const router = useRouter();
  const route = useRoute();
  const { isAuthenticated, checkAuth } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  const eventId = route.params?.id;

  useEffect(() => {
    if (isAuthenticated && eventId) {
      fetchEvent();
    }
  }, [isAuthenticated, eventId]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const fetchEvent = async () => {
    try {
      const data = await api.getEvent(eventId!);
      setEvent(data);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao carregar evento');
    } finally {
      setLoading(false);
    }
  };

  const handleViewAlbum = (albumId: string) => {
    router.push(`/gallery?eventId=${eventId}&albumId=${albumId}`);
  };

  const handleCreateAlbum = () => {
    Alert.alert('Novo Álbum', 'Funcionalidade em desenvolvimento');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Evento não encontrado</Text>
      </View>
    );
  }

  const isPhotographer = event.photographer?.user?.email === useAuth.getState().user?.email;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{event.name}</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Event Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="calendar-outline" size={20} color="#3b82f6" />
            </View>
            <View>
              <Text style={styles.infoLabel}>Data</Text>
              <Text style={styles.infoValue}>
                {new Date(event.date).toLocaleDateString('pt-PT', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </View>
          </View>

          {event.location && (
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="location-outline" size={20} color="#3b82f6" />
              </View>
              <View>
                <Text style={styles.infoLabel}>Localização</Text>
                <Text style={styles.infoValue}>{event.location}</Text>
              </View>
            </View>
          )}

          {event.description && (
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="document-text-outline" size={20} color="#3b82f6" />
              </View>
              <View>
                <Text style={styles.infoLabel}>Descrição</Text>
                <Text style={styles.infoValue}>{event.description}</Text>
              </View>
            </View>
          )}

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name={event.isPublic ? 'eye-outline' : 'eye-off-outline'} size={20} color={event.isPublic ? '#22c55e' : '#f59e0b'} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Visibilidade</Text>
              <Text style={[styles.infoValue, { color: event.isPublic ? '#22c55e' : '#f59e0b' }]}>
                {event.isPublic ? 'Público' : 'Privado'}
              </Text>
            </View>
          </View>
        </View>

        {/* Albums Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Álbuns ({event.albums.length})</Text>
          {isPhotographer && (
            <TouchableOpacity onPress={handleCreateAlbum} style={styles.addButton}>
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {event.albums.length > 0 ? (
          <View style={styles.albumsList}>
            {event.albums.map(album => (
              <TouchableOpacity key={album.id} style={styles.albumItem} onPress={() => handleViewAlbum(album.id)}>
                <View style={styles.albumIcon}>
                  <Ionicons name="images-outline" size={24} color="#3b82f6" />
                </View>
                <View style={styles.albumInfo}>
                  <Text style={styles.albumName}>{album.name}</Text>
                  <Text style={styles.albumCount}>{album._count.photos} foto{album._count.photos !== 1 ? 's' : ''}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyAlbums}>
            <Ionicons name="images-outline" size={48} color="#9ca3af" />
            <Text style={styles.emptyAlbumsTitle}>Nenhum álbum</Text>
            <Text style={styles.emptyAlbumsSubtitle}>
              {isPhotographer ? 'Crie o primeiro álbum para este evento' : 'O fotógrafo ainda não adicionou álbuns'}
            </Text>
            {isPhotographer && (
              <TouchableOpacity onPress={handleCreateAlbum} style={styles.createAlbumButton}>
                <Text style={styles.createAlbumButtonText}>Criar Álbum</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}