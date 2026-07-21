import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AvatarProps {
  name?: string;
  size?: number;
}

function getInitials(name?: string): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getColor(name?: string): string {
  const colors = ['#007AFF', '#FF6B6B', '#4ECDC4', '#FFD93D', '#6C5CE7', '#A8E6CF'];
  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function Avatar({ name, size = 80 }: AvatarProps) {
  const bgColor = getColor(name);
  const fontSize = size * 0.38;

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2, backgroundColor: bgColor }]}>
      <Text style={[styles.initials, { fontSize }]}>{getInitials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#fff',
    fontWeight: '700',
  },
});
