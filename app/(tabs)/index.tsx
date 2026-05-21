import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useCallback, useContext, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AgendaList, CalendarProvider, ExpandableCalendar } from 'react-native-calendars';
import { AppContext } from '../_layout';

export default function HomeScreen() {
  const [sections, setSections] = useState<{ title: string; data: any[] }[]>([
    { title: '2026-05-21', data: [{ name: 'Breakfast: Oatmeal with fruits' }, { name: 'Lunch: Grilled chicken salad' }] },
    { title: '2026-05-22', data: [{ name: 'Breakfast: Smoothie bowl' }, { name: 'Lunch: Quinoa and veggies' }] },
  ]);
  const { user } = useContext(AppContext);


  const renderItem = ({ item }: any) => {
    console.log('Rendering item:', item);
    return <ThemedView style={{ padding: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#eee' }}>
      <ThemedText>{item.name}</ThemedText>
    </ThemedView>;
  }

  const calendarRef = useRef<{ toggleCalendarPosition: () => boolean }>(null);
  const rotation = useRef(new Animated.Value(0));

  const toggleCalendarExpansion = useCallback(() => {
    const isOpen = calendarRef.current?.toggleCalendarPosition();
    Animated.timing(rotation.current, {
      toValue: isOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease)
    }).start();
  }, []);

  const renderHeader = useCallback(
    (date: any) => (
      <TouchableOpacity style={styles.header} onPress={toggleCalendarExpansion}>
        <Text style={styles.headerTitle}>{date?.toString('MMMM yyyy')}</Text>
      </TouchableOpacity>
    ),
    [toggleCalendarExpansion]
  );

  const onCalendarToggled = useCallback(
    (isOpen: boolean) => {
      rotation.current.setValue(isOpen ? 1 : 0);
    },
    [rotation]
  );

  const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

  console.log('Current Date:', currentDate);

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 16,
        backgroundColor: 'white'
      }}
    >
      <ThemedView style={[styles.stepContainer, { flex: 1 }]}>
        <ThemedText type="default">Welcome {user?.name}!</ThemedText>
        <ThemedText type="subtitle">Your Meal Plan</ThemedText>
        <CalendarProvider date={currentDate} onDateChanged={() => { }} onMonthChange={() => { }}>
          <ExpandableCalendar
            renderHeader={renderHeader}
            ref={calendarRef}
            onCalendarToggled={onCalendarToggled}
            style={styles.calendar}
          />
          <AgendaList
            sections={sections}
            renderItem={renderItem}
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            initialNumToRender={10}
          />
        </CalendarProvider>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  calendar: {
    paddingLeft: 20,
    paddingRight: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10
  },
  headerTitle: { fontSize: 16, fontWeight: 'bold', marginRight: 6 },
  section: {
    color: 'grey',
    textTransform: 'capitalize'
  }
});
