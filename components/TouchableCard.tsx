import { Touchable, TouchableOpacity, View } from 'react-native';
import React from 'react';

export default function TouchableCard({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress: () => void;
}) {
  return <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>;
}
