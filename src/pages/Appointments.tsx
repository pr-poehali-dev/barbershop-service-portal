import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Step, StepDescription, StepIndicator, StepSeparator, StepStatus, StepTitle, Stepper, useSteps } from "@/components/ui/stepper";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar, Clock, User, CreditCard, CheckCircle2 } from "lucide-react";
import { staff, timeSlots, StaffMember } from "@/utils/appointmentData";
import StaffList from "@/components/appointments/StaffList";
import DateTimePicker from "@/components/appointments/DateTimePicker";
import ServiceSelection, { ServiceItem } from "@/components/appointments/ServiceSelection";

// Service data (could be moved to a separate file)
const services: ServiceItem[] = [
  { id: 1, name: "Женская стрижка", price: 2500, duration: 60, categoryId: "haircut" },
  { id: 2, name: "Мужская стрижка", price: 1800, duration: 45, categoryId: "haircut" },
  { id: 3, name: "Детская стрижка", price: 1200, duration: 30, categoryId: "haircut" },
  { id: 4, name: "Стрижка челки", price: 800, duration: 15, categoryId: "haircut" },
  { id: 5, name: "Однотонное окрашивание", price: 3500, duration: 120, categoryId: "coloring" },
  { id: 6, name: "Мелирование", price: 4500, duration: 150, categoryId: "coloring" },
  { id: 7, name: "Балаяж", price: 6000, duration: 180, categoryId: "coloring" },
  { id: 8, name: "Омбре", price: 6500, duration: 180, categoryId: "coloring" },
  { id: 9, name: "Повседневная укладка", price: 1500, duration: 40, categoryId: "styling" },
  { id: 10, name: "Праздничная прическа", price: 3000, duration: 90, categoryId: "styling" },
  { id: 11, name: "Свадебная прическа", price: 5000, duration: 120, categoryId: "styling" },
  { id: 12, name: "Плетение кос", price: 2000, duration: 60, categoryId: "styling" },
  { id: 13, name: "Спа-уход для волос", price: 2500, duration: 60, categoryId: "treatments" },
  { id: 14, name: "Восстанавливающая маска", price: 1800, duration: 45, categoryId: "treatments" },
  { id: 15, name: "Кератиновое выпрямление", price: 7000, duration: 180, categoryId: "treatments" },
  { id: 16, name: "Ботокс для волос", price: 4500, duration: 90, categoryId: "treatments" }
];

// Define the steps
const steps = [
  { title: "Услуги", description: "Выбор услуг" },
  { title: "Мастер", description: "Выбор мастера" },
  { title: "Дата и время", description: "Выбор даты и времени" },
  { title: "Детали", description: "Ваши данные" },
  { title: "Подтверждение", description: "Подтверждение записи" }
];

// Form schema
const contactSchema = z.object({
  firstName: z.string().min(2, { message: "Имя должно содержать минимум 2 символа" }),
  lastName: z.string().min(2, { message: "Фамилия должна содержать минимум 2 символа" }),
  email: z.string().email({ message: "Введите корректный email" }),
  phone: z.string().min(10, { message: "Введите корректный номер телефона" }),
  notes: z.string().optional()
});

type ContactForm = z.infer<typeof contactSchema>;

const Appointments = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const serviceIdFromQuery = query.get('service');
  
  // Get step state
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });
  
  // State for selections
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // Form setup
  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      notes: ""
    },
  });
  
  // Initialize with service from query param if provided
  useEffect(() => {
    if (serviceIdFromQuery) {
      const service = services.find(s => s.id === parseInt(serviceIdFromQuery));
      if (service && !selectedServices.some(s => s.id === service.id)) {
        setSelectedServices([service]);
      }
    }
  }, [serviceIdFromQuery]);
  
  // Handle service selection
  const handleToggleService = (service: ServiceItem) => {
    setSelectedServices(prev => {
      const existingIndex = prev.findIndex(s => s.id === service.id);
      if (existingIndex >= 0) {
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };
  
  // Next step handler
  const handleNextStep = () => {
    // Validate current step
    if (activeStep === 0 && selectedServices.length === 0) {
      return; // Don't proceed if no services selected
    }
    
    if (activeStep === 1 && !selectedStaff) {
      return; // Don't proceed if no staff selected
    }
    
    if (activeStep === 2 && (!selectedDate || !selectedTime)) {
      return; // Don't proceed if date or time not selected
    }
    
    if (activeStep === 3) {
      // Validate form before proceeding to confirmation
      form.handleSubmit(() => {
        setActiveStep(prev => prev + 1);
      })();
      return;
    }
    
    // Move to next step
    setActiveStep(prev => prev + 1);
  };
  
  // Back step handler
  const handleBackStep = () => {
    setActiveStep(prev => prev - 1);
  };
  
  // Submit handler
  const onSubmit = (data: ContactForm) => {
    console.log("Form submitted", data);
    // In a real app, you would send this to your server
  };
  
  // Calculate total
  const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);
  const totalDuration = selectedServices.reduce((sum, service) => sum + service.duration, 0);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink as={Link} to="/">Главная</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink as={Link} to="/services">Услуги</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>Запись на услуги</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary">Запись на услуги</h1>
            <p className="mt-2 text-muted-foreground">
              Выберите услуги, мастера и удобное время для записи в наш салон
            </p>
          </div>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <Stepper index={activeStep} className="mb-8">
                {steps.map((step, index) => (
                  <Step key={index}>
                    <StepIndicator>
                      <StepStatus 
                        complete={<CheckCircle2 className="h-4 w-4" />}
                        incomplete={index + 1}
                        active={index + 1}
                      />
                    </StepIndicator>
                    
                    <div className="hidden md:block">
                      <StepTitle>{step.title}</StepTitle>
                      <StepDescription>{step.description}</StepDescription>
                    </div>
                    
                    <StepSeparator />
                  </Step>
                ))}
              </Stepper>
              
              <div className="mt-8">
                {/* Step 1: Service selection */}
                {activeStep === 0 && (
                  <ServiceSelection 
                    services={services}
                    selectedServices={selectedServices}
                    onToggleService={handleToggleService}
                  />
                )}
                
                {/* Step 2: Staff selection */}
                {activeStep === 1 && (
                  <StaffList 
                    staff={staff}
                    selectedStaff={selectedStaff}
                    onSelectStaff={setSelectedStaff}
                    selectedServiceIds={selectedServices.map(s => s.id)}
                  />
                )}
                
                {/* Step 3: Date and time selection */}
                {activeStep === 2 && (
                  <DateTimePicker 
                    timeSlots={timeSlots}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onSelectDate={setSelectedDate}
                    onSelectTime={setSelectedTime}
                  />
                )}
                
                {/* Step 4: Contact details */}
                {activeStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Ваши контактные данные</h3>
                    
                    <Form {...form}>
                      <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Имя</FormLabel>
                                <FormControl>
                                  <Input placeholder="Иван" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Фамилия</FormLabel>
                                <FormControl>
                                  <Input placeholder="Петров" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="example@mail.ru" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Телефон</FormLabel>
                                <FormControl>
                                  <Input placeholder="+7 (123) 456-78-90" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Дополнительная информация</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Любые особые пожелания или примечания..." 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </form>
                    </Form>
                  </div>
                )}
                
                {/* Step 5: Confirmation */}
                {activeStep === 4 && (
                  <div className="space-y-6">
                    <div className="text-center pb-6">
                      <div className="inline-flex items-center justify-center p-4 bg-primary/10 text-primary rounded-full mb-4">
                        <CheckCircle2 className="h-10 w-10" />
                      </div>
                      <h3 className="text-xl font-bold">Запись подтверждена</h3>
                      <p className="text-muted-foreground mt-2">
                        Мы с нетерпением ждем встречи с вами!
                      </p>
                    </div>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Детали записи</CardTitle>
                        <CardDescription>
                          Информация о вашей записи в салон
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between border-b border-border pb-2">
                          <span className="text-muted-foreground">Номер записи:</span>
                          <span className="font-medium">APT-{Math.floor(Math.random() * 10000)}</span>
                        </div>
                        
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-primary" />
                            <span className="text-muted-foreground">Мастер:</span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{selectedStaff?.name}</div>
                            <div className="text-sm text-muted-foreground">{selectedStaff?.position}</div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-primary" />
                            <span className="text-muted-foreground">Дата и время:</span>
                          </div>
                          <div className="text-right font-medium">
                            {selectedDate && (
                              <div>
                                {format(selectedDate, "d MMMM yyyy", { locale: ru })}
                              </div>
                            )}
                            <div>{selectedTime}</div>
                          </div>
                        </div>
                        
                        <div className="border-t border-border pt-4">
                          <div className="font-medium mb-2">Услуги:</div>
                          <ul className="space-y-2">
                            {selectedServices.map(service => (
                              <li key={service.id} className="flex justify-between">
                                <div>
                                  <span>{service.name}</span>
                                  <span className="text-sm text-muted-foreground ml-2">
                                    ({service.duration} мин)
                                  </span>
                                </div>
                                <span>{service.price} ₽</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex justify-between font-bold border-t border-border pt-4">
                          <div className="flex items-center">
                            <span>Итого:</span>
                            <span className="text-sm font-normal text-muted-foreground ml-2">
                              ({totalDuration} мин)
                            </span>
                          </div>
                          <span className="text-primary">{totalPrice} ₽</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-col space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Подтверждение отправлено на ваш email: {form.getValues().email}
                        </p>
                        <div className="flex gap-2">
                          <Button className="flex-1">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Оплатить онлайн
                          </Button>
                          <Button variant="outline" className="flex-1">
                            Добавить в календарь
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                )}
                
                {/* Navigation buttons */}
                <div className="flex justify-between mt-8">
                  <Button 
                    variant="outline" 
                    onClick={handleBackStep}
                    disabled={activeStep === 0}
                  >
                    Назад
                  </Button>
                  
                  {activeStep < steps.length - 1 ? (
                    <Button onClick={handleNextStep}>
                      Продолжить
                    </Button>
                  ) : (
                    <Link to="/">
                      <Button>
                        На главную
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Appointments;