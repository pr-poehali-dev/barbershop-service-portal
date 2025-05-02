import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { TimeSlot } from "@/utils/appointmentData";
import { Button } from "@/components/ui/button";
import { addDays, format, isToday, isTomorrow, isWeekend, startOfDay } from "date-fns";
import { ru } from "date-fns/locale";
import { Clock } from "lucide-react";

interface DateTimePickerProps {
  timeSlots: TimeSlot[];
  selectedDate: Date | undefined;
  selectedTime: string | null;
  onSelectDate: (date: Date | undefined) => void;
  onSelectTime: (time: string) => void;
}

const DateTimePicker = ({
  timeSlots,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime
}: DateTimePickerProps) => {
  // Filter time slots based on the selected date
  // In a real app, you would fetch available slots from the server
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    if (selectedDate) {
      // Simulate different availability based on the day of the week
      const day = selectedDate.getDay();
      let availableTimeSlots = [...timeSlots];
      
      if (isWeekend(selectedDate)) {
        // Weekend has fewer slots
        availableTimeSlots = availableTimeSlots.filter(slot => {
          const hour = parseInt(slot.time.split(':')[0]);
          return hour >= 10 && hour <= 16;
        });
      }
      
      // Randomize availability
      availableTimeSlots = availableTimeSlots.map(slot => ({
        ...slot,
        available: Math.random() > 0.3 // 70% chance of being available
      }));
      
      setAvailableSlots(availableTimeSlots);
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate, timeSlots]);

  // Format date for display
  const formatDateLabel = (date: Date) => {
    if (isToday(date)) return "Сегодня";
    if (isTomorrow(date)) return "Завтра";
    return format(date, "d MMMM", { locale: ru });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Выберите дату</h3>
        
        <div className="flex flex-nowrap overflow-x-auto pb-2 md:hidden space-x-2 mb-4">
          {Array.from({ length: 10 }).map((_, index) => {
            const date = addDays(new Date(), index);
            const isSelected = selectedDate && 
              startOfDay(selectedDate).getTime() === startOfDay(date).getTime();
            
            return (
              <Button
                key={index}
                variant={isSelected ? "default" : "outline"}
                className="whitespace-nowrap"
                onClick={() => onSelectDate(date)}
              >
                <span className="flex flex-col items-center">
                  <span className="text-xs">{format(date, "EEE", { locale: ru })}</span>
                  <span>{format(date, "d", { locale: ru })}</span>
                </span>
              </Button>
            );
          })}
        </div>
        
        <div className="hidden md:block">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onSelectDate}
            locale={ru}
            disabled={{ before: new Date() }}
            className="border rounded-md"
          />
        </div>
      </div>
      
      {selectedDate && (
        <div>
          <h3 className="text-lg font-medium mb-4">
            Доступное время на {formatDateLabel(selectedDate)}
          </h3>
          
          {availableSlots.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {availableSlots.map(slot => (
                <Button
                  key={slot.id}
                  variant={selectedTime === slot.time ? "default" : "outline"}
                  disabled={!slot.available}
                  className={`${!slot.available ? 'opacity-50' : ''}`}
                  onClick={() => slot.available && onSelectTime(slot.time)}
                >
                  <Clock className="mr-1 h-3 w-3" />
                  {slot.time}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Нет доступного времени на выбранную дату.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;