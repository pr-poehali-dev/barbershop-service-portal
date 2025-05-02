import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  CreditCard, 
  Calendar as CalendarIcon, 
  Lock, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";

// Валидация формы оплаты
const paymentFormSchema = z.object({
  paymentMethod: z.enum(["card", "online"], {
    required_error: "Выберите способ оплаты",
  }),
  cardNumber: z.string()
    .regex(/^\d{16}$/, { message: "Введите 16 цифр номера карты" })
    .optional()
    .or(z.literal("")),
  cardHolder: z.string()
    .min(3, { message: "Введите имя держателя карты" })
    .optional()
    .or(z.literal("")),
  expiryDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: "Введите дату в формате ММ/ГГ" })
    .optional()
    .or(z.literal("")),
  cvv: z.string()
    .regex(/^\d{3,4}$/, { message: "CVV должен содержать 3 или 4 цифры" })
    .optional()
    .or(z.literal(""))
}).refine(data => {
  // Если выбрана оплата картой, проверяем, что все поля заполнены
  if (data.paymentMethod === "card") {
    return !!data.cardNumber && !!data.cardHolder && !!data.expiryDate && !!data.cvv;
  }
  return true;
}, {
  message: "Для оплаты картой необходимо заполнить все поля",
  path: ["paymentMethod"],
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface PaymentFormProps {
  amount: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const PaymentForm = ({ amount, onSuccess, onCancel }: PaymentFormProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const { toast } = useToast();

  // Форма оплаты
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paymentMethod: "card",
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: ""
    }
  });

  // Имитация шлюза оплаты
  const processPayment = (data: PaymentFormValues) => {
    setIsProcessing(true);
    
    // Имитация API запроса
    setTimeout(() => {
      // Имитация успешной оплаты (в 90% случаев)
      const isSuccessful = Math.random() > 0.1;
      
      if (isSuccessful) {
        setIsSuccess(true);
        setIsError(false);
        toast({
          title: "Оплата прошла успешно",
          description: "Спасибо за вашу покупку!",
          duration: 3000
        });
        
        if (onSuccess) {
          setTimeout(onSuccess, 2000);
        }
      } else {
        setIsSuccess(false);
        setIsError(true);
        toast({
          title: "Ошибка оплаты",
          description: "Пожалуйста, проверьте данные карты и попробуйте снова",
          variant: "destructive",
          duration: 3000
        });
      }
      
      setIsProcessing(false);
    }, 2000);
  };

  // Обработка маски для номера карты
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
    form.setValue("cardNumber", value);
  };
  
  // Обработка маски для срока действия
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    
    form.setValue("expiryDate", value);
  };

  // Обработка отправки формы
  const onSubmit = (data: PaymentFormValues) => {
    console.log("Payment data:", data);
    processPayment(data);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center text-center p-6">
        <div className="w-16 h-16 bg-green-100 flex items-center justify-center rounded-full mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold mb-2">Оплата успешно проведена</h3>
        <p className="text-muted-foreground mb-6">
          Ваш платеж на сумму {amount} ₽ успешно обработан. Спасибо за покупку!
        </p>
        <Button onClick={onSuccess}>Продолжить</Button>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center text-center p-6">
        <div className="w-16 h-16 bg-red-100 flex items-center justify-center rounded-full mb-4">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-xl font-bold mb-2">Ошибка при оплате</h3>
        <p className="text-muted-foreground mb-6">
          К сожалению, произошла ошибка при обработке платежа. Пожалуйста, проверьте данные карты и попробуйте снова.
        </p>
        <div className="flex space-x-4">
          <Button variant="outline" onClick={() => setIsError(false)}>
            Попробовать снова
          </Button>
          <Button variant="default" onClick={onCancel}>
            Отменить
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">К оплате</h3>
          <p className="text-xl font-bold text-primary">{amount} ₽</p>
        </div>
        
        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Способ оплаты</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Банковская карта
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online">Онлайн платежная система</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {form.watch("paymentMethod") === "card" && (
          <Card>
            <CardContent className="p-4 space-y-4">
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Номер карты</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="1234 5678 9012 3456"
                          className="pl-10"
                          value={field.value}
                          onChange={handleCardNumberChange}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cardHolder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя держателя карты</FormLabel>
                    <FormControl>
                      <Input placeholder="IVAN IVANOV" {...field} className="uppercase" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Срок действия</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="MM/YY"
                            className="pl-10"
                            value={field.value}
                            onChange={handleExpiryDateChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cvv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVV</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="•••"
                            className="pl-10"
                            maxLength={4}
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                              form.setValue("cvv", value);
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="text-xs text-muted-foreground flex items-center mt-2">
                <Lock className="h-3 w-3 mr-1" />
                Данные вашей карты надежно защищены
              </div>
            </CardContent>
          </Card>
        )}
        
        {form.watch("paymentMethod") === "online" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              При выборе этого способа оплаты вы будете перенаправлены на страницу платежной системы, где сможете выбрать удобный для вас способ: электронный кошелек, мобильный платеж и другие.
            </p>
            <div className="flex items-center justify-center space-x-4 py-4">
              <img src="https://via.placeholder.com/80x40?text=PaySystem1" alt="Payment System 1" className="h-8 object-contain" />
              <img src="https://via.placeholder.com/80x40?text=PaySystem2" alt="Payment System 2" className="h-8 object-contain" />
              <img src="https://via.placeholder.com/80x40?text=PaySystem3" alt="Payment System 3" className="h-8 object-contain" />
            </div>
          </div>
        )}
        
        <div className="flex space-x-4">
          <Button type="button" variant="outline" className="w-full" onClick={onCancel}>
            Отмена
          </Button>
          <Button type="submit" className="w-full" disabled={isProcessing}>
            {isProcessing ? "Обработка..." : "Оплатить"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PaymentForm;