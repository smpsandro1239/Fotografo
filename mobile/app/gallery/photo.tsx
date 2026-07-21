import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, Share } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenshotProtect } from '@/components/ScreenshotProtect';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function PhotoScreen() {
  const router = useRouter();
  const { url, id } = useLocalSearchParams<{ url: string; id: string }>();
  const [loading, setLoading] = useState(true);

  const handleShare = async () => {
    try {
      await Share.share({ url: url || '' });
    } catch {}
  };

  return (
    <ScreenshotProtect>
      <View style={styles.container}>
        <Image
          source={{ uri: url }}
          style={styles.image}
          resizeMode="contain"
          onLoadEnd={() => setLoading(false)}
        />

        {/* Close */}
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={32} color="#fff" />
        </TouchableOpacity>

        {/* Share */}
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Ionicons name="share-outline" size={26} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScreenshotProtect>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  image: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
  closeBtn: {
    position: 'absolute', top: 56, left: 20,
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#3338', alignItems: 'center', justifyContent: 'center',
  },
  shareBtn: {
    position: 'absolute', top: 56, right: 20,
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#3338', alignItems: 'center', justifyContent: 'center',
  },
});
