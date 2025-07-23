import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Text } from './nativewindui/Text';

const TypingLoop = () => {
  const phrases = [
    { text: 'Planea.', speed: 50, delay: 1000 },
    { text: 'Cuida.', speed: 50, delay: 1000 },
    { text: 'Repite.', speed: 50, delay: 1000 },
    // { text: 'Ad Paws.', speed: 90, delay: 1500 },
  ];

  const [currentText, setCurrentText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const { text, speed = 100, delay = 1000 } = phrases[phraseIndex];
    let timeout: any;

    if (!isDeleting) {
      if (currentText.length < text.length) {
        timeout = setTimeout(() => {
          setCurrentText(text.slice(0, currentText.length + 1));
        }, speed);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), delay);
      }
    } else {
      if (currentText.length > 0) {
        timeout = setTimeout(() => {
          setCurrentText((prev) => prev.slice(0, -1));
        }, speed / 2);
      } else {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentText, isDeleting, phraseIndex]);

  return (
    <View className="flex-row items-center justify-center">
      <Text variant="title1" className="font-sofiaLight">
        {currentText}
      </Text>
      {showCursor && <Text variant="title1">|</Text>}
    </View>
  );
};

export default TypingLoop;
