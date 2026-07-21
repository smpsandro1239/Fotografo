import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Avatar } from '@/src/components/Avatar';
import { LoadingSpinner } from '@/src/components/LoadingSpinner';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      if (user?.role === 'PHOTOGRAPHER') {
        const data = await api.getPhotographerStats();
        setStats(data);
      } else if (user?.role === 'CLIENT') {
        const data = await api.getClientStats();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Tem a certeza que pretende sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const isPhotographer = user?.role === 'PHOTOGRAPHER';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <Text style={styles.headerTitle}>Perfil</Text>

      {/* Avatar */}
      <View style={styles.avatarSection}>
        <Avatar name={user?.name} size={100} />
        <Text style={styles.name}>{user?.name || 'Utilizador'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{isPhotographer ? 'Fotógrafo' : 'Cliente'}</Text>
        </View>
      </View>

      {/* Stats */}
      {stats && (
        <View style={styles.statsSection}>
          {isPhotographer ? (
            <>
              <StatBox label="Eventos" value={stats.totalEvents ?? 0} />
              <StatBox label="Fotos" value={stats.totalPhotos ?? 0} />
              <StatBox label="Receita" value={`€${stats.totalRevenue ?? 0}`} />
            </>
          ) : (
            <>
              <StatBox label="Reservas" value={stats.totalReservations ?? 0} />
              <StatBox label="Encomendas" value={stats.totalOrders ?? 0} />
            </>
          )}
        </View>
      )}

      {/* Menu */}
      <View style={styles.menu}>
        <MenuRow icon="create-outline" label="Editar Perfil" onPress={() => {}} />
        <MenuRow icon="settings-outline" label="Definições" onPress={() => router.push('/settings')} />
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function StatBox({ label, value }: { label: string; value: number | string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function MenuRow({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={icon} size={22} color="#fff" />
      <Text style={styles.menuLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#555" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: { paddingBottom: 40 },
  headerTitle: { fontSize: 34, fontWeight: '800', color: '#fff', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  avatarSection: { alignItems: 'center', paddingVertical: 20 },
  name: { fontSize: 22, fontWeight: '700', color: '#fff', marginTop: 14 },
  email: { fontSize: 15, color: '#888', marginTop: 4 },
  roleBadge: { marginTop: 10, backgroundColor: '#007AFF22', paddingHorizontal: 14, paddingVertical: 5, borderRadius: 14 },
  roleText: { fontSize: 13, fontWeight: '600', color: '#007AFF' },
  statsSection: { flexDirection: 'row', justifyContent: 'center', gap: 16, paddingHorizontal: 20, marginTop: 20 },
  statBox: { flex: 1, backgroundColor: '#1a1a1a', borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#2a2a2a', maxWidth: 140 },
  statValue: { fontSize: 24, fontWeight: '800', color: '#fff' },
  statLabel: { fontSize: 13, color: '#888', marginTop: 4 },
  menu: { marginTop: 28, paddingHorizontal: 20, gap: 2 },
  menuRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#2a2a2a', gap: 12 },
  menuLabel: { flex: 1, fontSize: 16, fontWeight: '600', color: '#fff' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 32, marginHorizontal: 20, padding: 16, backgroundColor: '#FF6B6B15', borderRadius: 14, borderWidth: 1, borderColor: '#FF6B6B33', gap: 8 },
  logoutText: { fontSize: 16, fontWeight: '600', color: '#FF6B6B' },
});
