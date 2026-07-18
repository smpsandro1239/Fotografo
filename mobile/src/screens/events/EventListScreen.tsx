import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import { api, Event } from '@/lib/api';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

export default function EventListScreen() {
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const fetchEvents = async () => {
    try {
      const data = await api.getEvents({ limit: 50 });
      setEvents(data.data || data);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao carregar eventos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  const handleCreateEvent = () => {
    router.push('/events/new');
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
        <Text style={styles.headerTitle}>Os Meus Eventos</Text>
        <TouchableOpacity onPress={handleCreateEvent} style={styles.addButton}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={events}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.eventCard} onPress={() => router.push(`/events/${item.id}`)}>
            <View style={styles.eventImageContainer}>
              <View style={styles.eventImagePlaceholder}>
                <Ionicons name="calendar-outline" size={32} color="#6b7280" />
              </View>
              <View style={styles.eventStatusBadge}>
                <Text style={[
                  styles.eventStatusText,
                  item.isPublic ? styles.statusPublic : styles.statusPrivate
                ]}>
                  {item.isPublic ? 'Público' : 'Privado'}
                </Text>
              </View>
            </View>
            <View style={styles.eventContent}>
              <Text style={styles.eventName}>{item.name}</Text>
              <View style={styles.eventMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="calendar-outline" size={14} color="#9ca3af" />
                  <Text style={styles.metaText}>
                    {new Date(item.date).toLocaleDateString('pt-PT', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
                {item.location && (
                  <View style={styles.metaItem}>
                    <Ionicons name="location-outline" size={14} color="#9ca3af" />
                    <Text style={styles.metaText}>{item.location}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color="#9ca3af" />
            <Text style={styles.emptyTitle}>Nenhum evento</Text>
            <Text style={styles.emptySubtitle}>
              Comece por criar o seu primeiro evento
            </Text>
            <TouchableOpacity onPress={handleCreateEvent} style={styles.createEventButton}>
              <Text style={styles.createEventButtonText}>Criar Evento</Text>
            </TouchableOpacity>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3b82f6']} />
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}