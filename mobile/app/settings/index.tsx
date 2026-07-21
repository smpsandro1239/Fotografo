import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/auth-context';
import { ScreenshotProtect } from '@/components/ScreenshotProtect';

export default function SettingsScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');

  const handleLogout = () => {
    Alert.alert('Logout', 'Tem a certeza que pretende sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <ScreenshotProtect>
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Definições</Text>
      </View>

      {/* Conta */}
      <Text style={styles.sectionTitle}>Conta</Text>
      <View style={styles.section}>
        <SettingsRow icon="create-outline" label="Editar perfil" onPress={() => {}} />
        <SettingsRow icon="lock-closed-outline" label="Mudar password" onPress={() => {}} />
      </View>

      {/* Notificações */}
      <Text style={styles.sectionTitle}>Notificações</Text>
      <View style={styles.section}>
        <View style={styles.switchRow}>
          <Ionicons name="notifications-outline" size={22} color="#fff" />
          <Text style={styles.switchLabel}>Push notifications</Text>
          <Switch
            value={pushEnabled}
            onValueChange={setPushEnabled}
            trackColor={{ false: '#333', true: '#007AFF' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Tema */}
      <Text style={styles.sectionTitle}>Tema</Text>
      <View style={styles.section}>
        {(['light', 'dark', 'system'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.themeRow, theme === t && styles.themeRowActive]}
            onPress={() => setTheme(t)}
          >
            <Text style={[styles.themeLabel, theme === t && styles.themeLabelActive]}>
              {t === 'light' ? 'Claro' : t === 'dark' ? 'Escuro' : 'Sistema'}
            </Text>
            {theme === t && <Ionicons name="checkmark" size={20} color="#007AFF" />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Sobre */}
      <Text style={styles.sectionTitle}>Sobre</Text>
      <View style={styles.section}>
        <SettingsRow icon="information-circle-outline" label="Versão" value="1.0.0" onPress={() => {}} />
        <SettingsRow icon="document-text-outline" label="Termos de uso" onPress={() => {}} />
        <SettingsRow icon="shield-checkmark-outline" label="Privacidade" onPress={() => {}} />
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
    </ScreenshotProtect>
  );
}

function SettingsRow({ icon, label, value, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; value?: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={icon} size={22} color="#fff" />
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        {value && <Text style={styles.rowValue}>{value}</Text>}
        <Ionicons name="chevron-forward" size={18} color="#555" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: { paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12, gap: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1a1a1a', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#fff' },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: 1, paddingHorizontal: 20, marginTop: 28, marginBottom: 10 },
  section: { marginHorizontal: 20, backgroundColor: '#1a1a1a', borderRadius: 14, borderWidth: 1, borderColor: '#2a2a2a', overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12, borderBottomWidth: 1, borderBottomColor: '#2a2a2a' },
  rowLabel: { flex: 1, fontSize: 16, fontWeight: '600', color: '#fff' },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rowValue: { fontSize: 14, color: '#888' },
  switchRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  switchLabel: { flex: 1, fontSize: 16, fontWeight: '600', color: '#fff' },
  themeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#2a2a2a' },
  themeRowActive: { backgroundColor: '#007AFF15' },
  themeLabel: { fontSize: 16, fontWeight: '600', color: '#fff' },
  themeLabelActive: { color: '#007AFF' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 32, marginHorizontal: 20, padding: 16, backgroundColor: '#FF6B6B15', borderRadius: 14, borderWidth: 1, borderColor: '#FF6B6B33', gap: 8 },
  logoutText: { fontSize: 16, fontWeight: '600', color: '#FF6B6B' },
});
