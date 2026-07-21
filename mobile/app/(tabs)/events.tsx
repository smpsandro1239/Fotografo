import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { api, Event } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { EventCard } from '@/src/components/EventCard';
import { EmptyState } from '@/src/components/EmptyState';

export default function EventsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadEvents = async () => {
    try {
      const res = await api.getEvents({ limit: 50 });
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Eventos</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Eventos</Text>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007AFF" />}
      >
        {events.length === 0 ? (
          <EmptyState
            icon="calendar-outline"
            title="Sem eventos"
            message="Ainda não existem eventos disponíveis."
          />
        ) : (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() => router.push(`/events/${event.id}`)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#fff',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
