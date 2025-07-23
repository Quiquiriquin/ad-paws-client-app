import { View } from 'react-native';
import React from 'react';

type GridListProps = {
  children: React.ReactNode;
};

export default function GridList({ children }: GridListProps) {
  return (
    <View className="flex-row flex-wrap justify-between">
      {React.Children.toArray(children).map((child, idx) => (
        <View
          key={idx}
          className="bg-brandLight
            mb-4
            w-[48%]
            rounded-md md:w-[30%] lg:w-[22%]">
          {child}
        </View>
      ))}
    </View>
  );
}
