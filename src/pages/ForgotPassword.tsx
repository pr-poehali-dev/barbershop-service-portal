import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, Mail, Check, Lock, Eye, EyeOff } from "lucide-react";
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
import { useAuth } from "@/hooks/useAuth";

// Форма восстановления пароля
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Введите корректный email" })
});

// Форма сброса пароля
const resetPasswordSchema = z.object({
  password: z.string().min(6, { message: "Пароль должен содержать минимум 6 символов" }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"]
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { requestPasswordReset, setNewPassword, isLoading } = useAuth();

  // Форма восстановления пароля
  const forgotForm = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  });

  // Форма сброса пароля
  const resetForm = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

  // Обработка отправки формы запроса сброса пароля
  const onForgotSubmit = async (data: ForgotPasswordValues) => {
    try {
      await requestPasswordReset(data);
      setIsSubmitted(true);
    } catch (error) {
      // Ошибки уже обрабатываются в API-клиенте
      console.error("Password reset request failed", error);
    }
  };

  // Обработка отправки формы установки нового пароля
  const onResetSubmit = async (data: ResetPasswordValues) => {
    if (!token) {
      toast({
        title: "Ошибка",
        description: "Отсутствует токен сброса пароля",
        variant: "destructive"
      });
      return;
    }

    try {
      await setNewPassword({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword
      });
      // Перенаправление и тост уже обрабатываются в хуке useAuth
    } catch (error) {
      // Ошибки уже обрабатываются в API-клиенте
      console.error("Password reset failed", error);
    }
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
          {/* Форма запроса сброса пароля */}
          {!token && !isSubmitted && (
            <>
              <CardHeader>
                <CardTitle>Забыли пароль?</CardTitle>
                <CardDescription>
                  Введите ваш email и мы отправим вам инструкции по восстановлению пароля
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...forgotForm}>
                  <form onSubmit={forgotForm.handleSubmit(onForgotSubmit)} className="space-y-4">
                    <FormField
                      control={forgotForm.control}
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
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Отправка..." : "Восстановить пароль"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </>
          )}

          {/* Сообщение об отправке письма */}
          {!token && isSubmitted && (
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

          {/* Форма установки нового пароля */}
          {token && (
            <>
              <CardHeader>
                <CardTitle>Установка нового пароля</CardTitle>
                <CardDescription>
                  Введите новый пароль для вашей учетной записи
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...resetForm}>
                  <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
                    <FormField
                      control={resetForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Новый пароль</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="••••••"
                                type={showPassword ? "text" : "password"}
                                className="pl-10"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={resetForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Подтверждение пароля</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="••••••"
                                type={showConfirmPassword ? "text" : "password"}
                                className="pl-10"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Сохранение..." : "Сохранить новый пароль"}
                    </Button>
                  </form>
                </Form>
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