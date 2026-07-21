import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Event } from '@/lib/api';

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
}

function statusColor(isPublic: boolean): string {
  return isPublic ? '#4ECDC4' : '#FFD93D';
}

function statusLabel(isPublic: boolean): string {
  return isPublic ? 'Público' : 'Privado';
}

export function EventCard({ event, onPress }: EventCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>{event.name}</Text>
        <View style={[styles.badge, { backgroundColor: statusColor(event.isPublic) + '22' }]}>
          <Text style={[styles.badgeText, { color: statusColor(event.isPublic) }]}>
            {statusLabel(event.isPublic)}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="calendar-outline" size={14} color="#888" />
        <Text style={styles.infoText}>{formatDate(event.date)}</Text>
      </View>

      {event.location && (
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={14} color="#888" />
          <Text style={styles.infoText} numberOfLines={1}>{event.location}</Text>
        </View>
      )}

      {event._count && (
        <View style={styles.counts}>
          <Text style={styles.countText}>{event._count.albums} álbuns</Text>
          <Text style={styles.countDot}>·</Text>
          <Text style={styles.countText}>{event._count.photos} fotos</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#888',
    flex: 1,
  },
  counts: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  countText: {
    fontSize: 13,
    color: '#666',
  },
  countDot: {
    fontSize: 13,
    color: '#444',
  },
});
