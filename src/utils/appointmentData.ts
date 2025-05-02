export interface StaffMember {
  id: number;
  name: string;
  position: string;
  image: string;
  specialties: string[];
  experience: number;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export const staff: StaffMember[] = [
  {
    id: 1,
    name: "Елена Иванова",
    position: "Старший стилист",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    specialties: ["стрижки", "окрашивание", "укладка"],
    experience: 8
  },
  {
    id: 2,
    name: "Алексей Петров",
    position: "Стилист-колорист",
    image: "https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    specialties: ["окрашивание", "мелирование", "балаяж"],
    experience: 5
  },
  {
    id: 3,
    name: "Мария Сидорова",
    position: "Мастер по укладкам",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    specialties: ["укладка", "прически", "плетение"],
    experience: 6
  },
  {
    id: 4,
    name: "Дмитрий Козлов",
    position: "Барбер",
    image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    specialties: ["мужские стрижки", "бритье", "оформление бороды"],
    experience: 4
  },
  {
    id: 5,
    name: "Анна Смирнова",
    position: "Стилист-универсал",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    specialties: ["стрижки", "укладка", "уход за волосами"],
    experience: 7
  }
];

export const timeSlots: TimeSlot[] = [
  { id: "09-00", time: "09:00", available: true },
  { id: "09-30", time: "09:30", available: true },
  { id: "10-00", time: "10:00", available: false },
  { id: "10-30", time: "10:30", available: true },
  { id: "11-00", time: "11:00", available: true },
  { id: "11-30", time: "11:30", available: true },
  { id: "12-00", time: "12:00", available: false },
  { id: "12-30", time: "12:30", available: false },
  { id: "13-00", time: "13:00", available: true },
  { id: "13-30", time: "13:30", available: true },
  { id: "14-00", time: "14:00", available: true },
  { id: "14-30", time: "14:30", available: false },
  { id: "15-00", time: "15:00", available: true },
  { id: "15-30", time: "15:30", available: true },
  { id: "16-00", time: "16:00", available: true },
  { id: "16-30", time: "16:30", available: true },
  { id: "17-00", time: "17:00", available: false },
  { id: "17-30", time: "17:30", available: true },
  { id: "18-00", time: "18:00", available: true },
  { id: "18-30", time: "18:30", available: true },
  { id: "19-00", time: "19:00", available: true },
  { id: "19-30", time: "19:30", available: true }
];