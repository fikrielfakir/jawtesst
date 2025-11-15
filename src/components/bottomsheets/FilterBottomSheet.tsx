import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { X } from '@tamagui/lucide-icons';
import { authDesign } from '@constants/theme/authDesign';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT * 0.45;

interface FilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedDistance: number;
  onDistanceChange: (distance: number) => void;
}

const MIN_DISTANCE = 1;
const MAX_DISTANCE = 50;

export function FilterBottomSheet({
  visible,
  onClose,
  selectedDistance,
  onDistanceChange,
}: FilterBottomSheetProps) {
  const slideAnim = useRef(new Animated.Value(BOTTOM_SHEET_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [localDistance, setLocalDistance] = useState(selectedDistance);
  const [trackWidth, setTrackWidth] = useState(SCREEN_WIDTH - 48);

  useEffect(() => {
    if (visible) {
      setIsModalVisible(true);
      setLocalDistance(selectedDistance);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (isModalVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: BOTTOM_SHEET_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsModalVisible(false);
      });
    }
  }, [visible]);

  const handleClose = () => {
    onClose();
  };

  const handleApply = () => {
    onDistanceChange(localDistance);
    onClose();
  };

  const handleTrackLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setTrackWidth(width);
  };

  const handleSliderStart = (event: any) => {
    const { locationX } = event.nativeEvent;
    const percentage = Math.max(0, Math.min(1, locationX / trackWidth));
    const newDistance = Math.round(MIN_DISTANCE + percentage * (MAX_DISTANCE - MIN_DISTANCE));
    setLocalDistance(newDistance);
  };

  const handleSliderMove = (event: any) => {
    const { locationX } = event.nativeEvent;
    const percentage = Math.max(0, Math.min(1, locationX / trackWidth));
    const newDistance = Math.round(MIN_DISTANCE + percentage * (MAX_DISTANCE - MIN_DISTANCE));
    setLocalDistance(newDistance);
  };

  const sliderPercentage = (localDistance - MIN_DISTANCE) / (MAX_DISTANCE - MIN_DISTANCE);
  const thumbLeft = sliderPercentage * trackWidth;

  return (
    <Modal
      visible={isModalVisible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.modalContainer}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: backdropOpacity,
              },
            ]}
          />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.bottomSheet,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.handleBar} />

          <View style={styles.header}>
            <Text style={styles.title}>Filter by Distance</Text>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.closeButton}
              activeOpacity={0.7}
            >
              <X size={24} color={authDesign.colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.subtitle}>
              Select maximum distance from your location
            </Text>

            <View style={styles.sliderContainer}>
              <Text style={styles.distanceValue}>{localDistance} km</Text>
              
              <View 
                style={styles.sliderTrack}
                onLayout={handleTrackLayout}
                onStartShouldSetResponder={() => true}
                onResponderGrant={handleSliderStart}
                onResponderMove={handleSliderMove}
              >
                <View 
                  style={[
                    styles.sliderFill, 
                    { width: sliderPercentage * trackWidth }
                  ]} 
                />
                <View
                  style={[
                    styles.sliderThumb,
                    { left: thumbLeft }
                  ]}
                />
              </View>

              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>{MIN_DISTANCE} km</Text>
                <Text style={styles.sliderLabel}>{MAX_DISTANCE} km</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApply}
              activeOpacity={0.8}
            >
              <Text style={styles.applyButtonText}>Apply Filter</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.66)',
  },
  bottomSheet: {
    height: BOTTOM_SHEET_HEIGHT,
    backgroundColor: authDesign.colors.backgroundsheet,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    boxShadow: '0px -4px 16px rgba(0, 0, 0, 0.3)',
    elevation: 10,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: authDesign.colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 32,
    fontWeight: '500',
  },
  sliderContainer: {
    marginBottom: 40,
  },
  distanceValue: {
    fontSize: 36,
    fontWeight: '700',
    color: authDesign.colors.primaryicon,
    textAlign: 'center',
    marginBottom: 32,
  },
  sliderTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 4,
    position: 'relative',
    marginBottom: 12,
  },
  sliderFill: {
    height: '100%',
    backgroundColor: authDesign.colors.primaryicon,
    borderRadius: 4,
  },
  sliderThumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: authDesign.colors.textPrimary,
    top: -8,
    marginLeft: -12,
    borderWidth: 3,
    borderColor: authDesign.colors.primaryicon,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  sliderLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: authDesign.colors.primary,
    paddingVertical: 16,
    borderRadius: authDesign.sizes.cornerRadius,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 24,
  },
  applyButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: authDesign.colors.textPrimary,
  },
});
