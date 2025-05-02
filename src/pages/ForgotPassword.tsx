import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, Mail, Check } from "lucide-react";
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

// Форма восстановления пароля
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Введите корректный email" })
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Форма восстановления пароля
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  });

  // Обработка отправки формы
  const onSubmit = (data: ForgotPasswordValues) => {
    // В реальном приложении здесь будет запрос к API
    console.log("Forgot password data:", data);
    
    // Имитация успешной отправки письма
    toast({
      title: "Письмо отправлено",
      description: `Инструкции по сбросу пароля отправлены на ${data.email}`,
      duration: 3000
    });
    
    // Показываем блок с подтверждением
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/">
            <h2 className="text-3xl font-extrabold text-primary">Стиль</h2>
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            Восстановление пароля
          </p>
        </div>

        <Card>
          {!isSubmitted ? (
            <>
              <CardHeader>
                <CardTitle>Забыли пароль?</CardTitle>
                <CardDescription>
                  Введите ваш email и мы отправим вам инструкции по восстановлению пароля
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="email@example.com"
                                type="email"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">
                      Восстановить пароль
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-center mt-4">Проверьте вашу почту</CardTitle>
                <CardDescription className="text-center">
                  Мы отправили инструкции по восстановлению пароля на указанный email. 
                  Если вы не получили письмо, проверьте папку "Спам".
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center text-sm text-muted-foreground">
                Не получили письмо? <Button variant="link" className="p-0 h-auto" onClick={() => setIsSubmitted(false)}>Отправить снова</Button>
              </CardContent>
            </>
          )}
          <CardFooter>
            <Button variant="ghost" className="w-full" asChild>
              <Link to="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Вернуться на страницу входа
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;