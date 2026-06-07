import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    FadeInDown,
    FadeOutLeft,
    LinearTransition,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";

import TripCard from "@/components/TripCard";
import type { Trip } from "@/types/trip";

interface AnimatedTripCardProps {
  trip: Trip;
  index: number;
  onPress: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function AnimatedTripCard({
  trip,
  index,
  onPress,
  onDelete,
}: AnimatedTripCardProps) {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);

  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      scale.value = withSpring(0.97, {
        damping: 15,
        stiffness: 400,
      });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, {
        damping: 10,
        stiffness: 200,
      });
    });

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      if (event.translationX < 0) {
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      if (event.translationX < -80) {
        translateX.value = withTiming(-500, { duration: 300 }, (finished) => {
          if (finished) {
            runOnJS(onDelete)(trip.id);
          }
        });
      } else {
        translateX.value = withSpring(0);
      }
    });

  const gesture = Gesture.Simultaneous(tapGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80).springify()}
      exiting={FadeOutLeft.springify()}
      layout={LinearTransition.springify()}
    >
      <GestureDetector gesture={gesture}>
        <Animated.View style={animatedStyle}>
          <TripCard
            id={trip.id}
            title={trip.title}
            destination={trip.destination}
            date={trip.date}
            rating={trip.rating}
            imageUri={trip.imageUri}
            category={trip.category}
            notes={trip.notes}
            onPress={onPress}
            onDeleteTrip={onDelete}
          />
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}
