import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, Info } from "lucide-react";
import { format, isEqual, isToday, isTomorrow, addDays, isSameDay, startOfDay, addWeeks, isAfter, isBefore } from "date-fns";
import { ru } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TimeSlot, formatDisplayTime } from "@/services/appointmentService";

interface DateTimePickerProps {
  timeSlots: TimeSlot[];
  selectedDate: Date | undefined;
  selectedTime: string | null;
  onSelectDate: (date: Date) => void;
  onSelectTime: (time: string | null) => void;
  isLoading?: boolean;
}

const DateTimePicker = ({ 
  timeSlots, 
  selectedDate, 
  selectedTime, 
  onSelectDate, 
  onSelectTime,
  isLoading = false
}: DateTimePickerProps) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  // Устанавливаем диапазон доступных дат (например, от сегодня до 2 недель вперед)
  const today = startOfDay(new Date());
  const maxDate = addWeeks(today, 2);
  
  // Группируем временные слоты по интервалам (утро, день, вечер)
  const morningSlots = timeSlots.filter(slot => {
    const hour = parseInt(slot.startTime.split(':')[0]);
    return hour >= 9 && hour < 12;
  });
  
  const afternoonSlots = timeSlots.filter(slot => {
    const hour = parseInt(slot.startTime.split(':')[0]);
    return hour >= 12 && hour < 17;
  });
  
  const eveningSlots = timeSlots.filter(slot => {
    const hour = parseInt(slot.startTime.split(':')[0]);
    return hour >= 17 && hour <= 21;
  });
  
  // Получение доступных слотов
  const availableSlots = timeSlots.filter(slot => slot.available);
  
  // Форматирование даты для отображения
  const getFormattedDate = (date: Date | undefined) => {
    if (!date) return "Выберите дату";
    
    if (isToday(date)) {
      return `Сегодня, ${format(date, "d MMMM", { locale: ru })}`;
    } else if (isTomorrow(date)) {
      return `Завтра, ${format(date, "d MMMM", { locale: ru })}`;
    } else {
      return format(date, "EEEE, d MMMM", { locale: ru });
    }
  };
  
  // Обработчик выбора даты
  const handleSelectDate = (date: Date | undefined) => {
    if (date) {
      onSelectDate(date);
      setCalendarOpen(false);
    }
  };
  
  // Обработчик выбора времени
  const handleSelectTime = (time: string) => {
    if (time === selectedTime) {
      onSelectTime(null);
    } else {
      onSelectTime(time);
    }
  };

  // Переключение на следующий день
  const handleNextDay = () => {
    if (selectedDate) {
      const nextDay = addDays(selectedDate, 1);
      if (!isAfter(nextDay, maxDate)) {
        onSelectDate(nextDay);
      }
    } else {
      onSelectDate(today);
    }
  };
  
  // Переключение на предыдущий день
  const handlePrevDay = () => {
    if (selectedDate) {
      const prevDay = addDays(selectedDate, -1);
      if (!isBefore(prevDay, today)) {
        onSelectDate(prevDay);
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Выберите дату и время</h3>
      
      {/* Выбор даты */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevDay}
          disabled={!selectedDate || isEqual(startOfDay(selectedDate), today)}
        >
          <span className="sr-only">Предыдущий день</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </Button>
        
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex-1 justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {getFormattedDate(selectedDate)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleSelectDate}
              disabled={(date) => 
                isBefore(date, today) || isAfter(date, maxDate)
              }
              initialFocus
              locale={ru}
            />
          </PopoverContent>
        </Popover>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextDay}
          disabled={!selectedDate || isEqual(startOfDay(selectedDate), maxDate)}
        >
          <span className="sr-only">Следующий день</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </Button>
      </div>
      
      {/* Выбор времени */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {Array(10).fill(0).map((_, index) => (
              <Skeleton key={index} className="h-10" />
            ))}
          </div>
        </div>
      ) : selectedDate ? (
        <div>
          {availableSlots.length === 0 ? (
            <div className="p-6 text-center border rounded-md bg-muted">
              <Info className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="font-medium">На выбранную дату нет доступных слотов</p>
              <p className="text-sm text-muted-foreground mt-1">
                Пожалуйста, выберите другую дату или свяжитесь с нами для уточнения
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Утро */}
              {morningSlots.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <circle cx="12" cy="12" r="4"/>
                      <path d="M12 2v2"/>
                      <path d="M12 20v2"/>
                      <path d="M4.93 4.93l1.41 1.41"/>
                      <path d="m17.66 17.66 1.41 1.41"/>
                      <path d="M2 12h2"/>
                      <path d="M20 12h2"/>
                      <path d="m6.34 17.66-1.41 1.41"/>
                      <path d="m19.07 4.93-1.41 1.41"/>
                    </svg>
                    Утро (9:00 - 12:00)
                  </h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {morningSlots.map((slot) => (
                      <Button
                        key={slot.startTime}
                        variant={selectedTime === slot.startTime ? "default" : "outline"}
                        size="sm"
                        className="h-10"
                        disabled={!slot.available}
                        onClick={() => handleSelectTime(slot.startTime)}
                      >
                        <Clock className="mr-1 h-3.5 w-3.5" />
                        {formatDisplayTime(slot.startTime)}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* День */}
              {afternoonSlots.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 2v1"/>
                      <path d="M12 21v1"/>
                      <path d="M4.2 4.2l.8.8"/>
                      <path d="m19 19-.8-.8"/>
                      <path d="M2 12h1"/>
                      <path d="M21 12h1"/>
                      <path d="m4.2 19.8.8-.8"/>
                      <path d="m19 5-.8.8"/>
                    </svg>
                    День (12:00 - 17:00)
                  </h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {afternoonSlots.map((slot) => (
                      <Button
                        key={slot.startTime}
                        variant={selectedTime === slot.startTime ? "default" : "outline"}
                        size="sm"
                        className="h-10"
                        disabled={!slot.available}
                        onClick={() => handleSelectTime(slot.startTime)}
                      >
                        <Clock className="mr-1 h-3.5 w-3.5" />
                        {formatDisplayTime(slot.startTime)}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Вечер */}
              {eveningSlots.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                    </svg>
                    Вечер (17:00 - 21:00)
                  </h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {eveningSlots.map((slot) => (
                      <Button
                        key={slot.startTime}
                        variant={selectedTime === slot.startTime ? "default" : "outline"}
                        size="sm"
                        className="h-10"
                        disabled={!slot.available}
                        onClick={() => handleSelectTime(slot.startTime)}
                      >
                        <Clock className="mr-1 h-3.5 w-3.5" />
                        {formatDisplayTime(slot.startTime)}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 text-center border rounded-md bg-muted">
          <CalendarIcon className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
          <p className="font-medium">Сначала выберите дату</p>
          <p className="text-sm text-muted-foreground mt-1">
            После выбора даты здесь отобразятся доступные временные слоты
          </p>
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;