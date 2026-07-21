import React from 'react';
import { FlatList, TouchableOpacity, Image, View, StyleSheet, Dimensions } from 'react-native';
import { Photo } from '@/lib/api';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoPress: (photo: Photo) => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const COLUMNS = 3;
const GAP = 3;
const ITEM_SIZE = (SCREEN_WIDTH - GAP * (COLUMNS + 1)) / COLUMNS;

export function PhotoGrid({ photos, onPhotoPress }: PhotoGridProps) {
  return (
    <FlatList
      data={photos}
      numColumns={COLUMNS}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onPhotoPress(item)} activeOpacity={0.7}>
          <Image
            source={{ uri: item.thumbnail || item.url }}
            style={styles.image}
            resizeMode="cover"
          />
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: GAP,
  },
  row: {
    gap: GAP,
  },
  image: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: 4,
    backgroundColor: '#1a1a1a',
  },
});
