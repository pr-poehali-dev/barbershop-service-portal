import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PaymentForm from "@/components/payment/PaymentForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ShoppingBag, ShoppingCart, Truck, Clock, Shield } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useToast } from "@/components/ui/use-toast";

// Мок данные для товаров в корзине
const cartItems = [
  {
    id: 1,
    name: "Шампунь для объема",
    price: 1200,
    image: "https://images.unsplash.com/photo-1626766632648-f4ed492cf6c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    quantity: 1
  },
  {
    id: 2,
    name: "Кондиционер питательный",
    price: 950,
    image: "https://images.unsplash.com/photo-1617391258031-f8d80b22fb25?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    quantity: 1
  }
];

const Checkout = () => {
  const [activeStep, setActiveStep] = useState<"cart" | "delivery" | "payment">("cart");
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "courier">("pickup");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Рассчет суммы товаров
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCost = deliveryMethod === "courier" ? 300 : 0;
  const total = subtotal + deliveryCost;

  // Обработчик успешной оплаты
  const handlePaymentSuccess = () => {
    setIsPaymentSuccess(true);
    toast({
      title: "Заказ оформлен",
      description: "Спасибо за покупку! Ваш заказ успешно оформлен.",
      duration: 3000
    });
    
    // Перенаправление на страницу с благодарностью
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink as={Link} to="/">Главная</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink as={Link} to="/shop">Магазин</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink as={Link} to="/cart">Корзина</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink className="font-medium">Оформление заказа</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <h1 className="text-3xl font-bold mb-8 text-center">Оформление заказа</h1>
          
          {isPaymentSuccess ? (
            <div className="max-w-md mx-auto text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-green-100 flex items-center justify-center rounded-full">
                  <ShoppingCart className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4">Спасибо за ваш заказ!</h2>
              <p className="text-muted-foreground mb-6">
                Ваш заказ успешно оформлен. Номер заказа: <span className="font-medium">#12345</span>.
                Вы получите подтверждение на указанный email.
              </p>
              <Button asChild>
                <Link to="/">Вернуться на главную</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Tabs 
                  value={activeStep} 
                  onValueChange={(value) => setActiveStep(value as "cart" | "delivery" | "payment")}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="cart" disabled={activeStep !== "cart"}>Корзина</TabsTrigger>
                    <TabsTrigger value="delivery" disabled={activeStep !== "delivery" && activeStep !== "cart"}>Доставка</TabsTrigger>
                    <TabsTrigger value="payment" disabled={activeStep !== "payment"}>Оплата</TabsTrigger>
                  </TabsList>
                  
                  {/* Шаг 1: Корзина */}
                  <TabsContent value="cart">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <ShoppingBag className="mr-2 h-5 w-5" />
                          Товары в корзине
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center py-2">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-md mr-4"
                              />
                              <div className="flex-1">
                                <h3 className="font-medium">{item.name}</h3>
                                <p className="text-sm text-muted-foreground">Количество: {item.quantity}</p>
                              </div>
                              <p className="font-bold">{item.price} ₽</p>
                            </div>
                          ))}
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Подытог</span>
                            <span>{subtotal} ₽</span>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <Button 
                            className="w-full" 
                            onClick={() => setActiveStep("delivery")}
                          >
                            Перейти к доставке
                          </Button>
                          <div className="mt-4 flex justify-center">
                            <Button variant="link" asChild>
                              <Link to="/shop">
                                <ArrowLeft className="mr-1 h-4 w-4" />
                                Вернуться к покупкам
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Шаг 2: Доставка */}
                  <TabsContent value="delivery">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Truck className="mr-2 h-5 w-5" />
                          Способ доставки
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div 
                            className={`p-4 border rounded-md cursor-pointer transition-colors ${
                              deliveryMethod === "pickup" ? "border-primary bg-primary/5" : "border-border"
                            }`}
                            onClick={() => setDeliveryMethod("pickup")}
                          >
                            <div className="flex items-center">
                              <div className={`w-4 h-4 rounded-full mr-3 border ${
                                deliveryMethod === "pickup" ? "border-primary bg-primary" : "border-muted-foreground"
                              }`} />
                              <div>
                                <h3 className="font-medium">Самовывоз из салона</h3>
                                <p className="text-sm text-muted-foreground">Бесплатно</p>
                              </div>
                            </div>
                          </div>
                          
                          <div 
                            className={`p-4 border rounded-md cursor-pointer transition-colors ${
                              deliveryMethod === "courier" ? "border-primary bg-primary/5" : "border-border"
                            }`}
                            onClick={() => setDeliveryMethod("courier")}
                          >
                            <div className="flex items-center">
                              <div className={`w-4 h-4 rounded-full mr-3 border ${
                                deliveryMethod === "courier" ? "border-primary bg-primary" : "border-muted-foreground"
                              }`} />
                              <div>
                                <h3 className="font-medium">Курьерская доставка</h3>
                                <p className="text-sm text-muted-foreground">300 ₽, доставка в течение 1-2 дней</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {deliveryMethod === "courier" && (
                          <div className="mt-6 space-y-4">
                            <h3 className="font-medium">Адрес доставки</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Имя</label>
                                <input 
                                  type="text" 
                                  className="w-full p-2 border border-border rounded-md"
                                  placeholder="Иван"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Фамилия</label>
                                <input 
                                  type="text" 
                                  className="w-full p-2 border border-border rounded-md"
                                  placeholder="Иванов"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Телефон</label>
                              <input 
                                type="text" 
                                className="w-full p-2 border border-border rounded-md"
                                placeholder="+7 (___) ___-__-__"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Адрес</label>
                              <input 
                                type="text" 
                                className="w-full p-2 border border-border rounded-md"
                                placeholder="Улица, дом, квартира"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Город</label>
                                <input 
                                  type="text" 
                                  className="w-full p-2 border border-border rounded-md"
                                  placeholder="Москва"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Индекс</label>
                                <input 
                                  type="text" 
                                  className="w-full p-2 border border-border rounded-md"
                                  placeholder="123456"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {deliveryMethod === "pickup" && (
                          <div className="mt-6 space-y-4">
                            <h3 className="font-medium">Наш адрес</h3>
                            <p className="text-sm">г. Москва, ул. Примерная, д. 123</p>
                            <p className="text-sm">
                              Время работы: 10:00 - 20:00 ежедневно
                            </p>
                            <div className="rounded-md overflow-hidden h-40 bg-muted">
                              {/* Здесь в реальном приложении будет карта */}
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-muted-foreground">Карта местоположения</span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-6 flex justify-between">
                          <Button 
                            variant="outline" 
                            onClick={() => setActiveStep("cart")}
                          >
                            Назад
                          </Button>
                          <Button 
                            onClick={() => setActiveStep("payment")}
                          >
                            Перейти к оплате
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Шаг 3: Оплата */}
                  <TabsContent value="payment">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Shield className="mr-2 h-5 w-5" />
                          Оплата заказа
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <PaymentForm 
                          amount={total} 
                          onSuccess={handlePaymentSuccess}
                          onCancel={() => setActiveStep("delivery")}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Сводка заказа */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Сводка заказа</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex justify-between items-center">
                            <span className="text-sm">
                              {item.name} x{item.quantity}
                            </span>
                            <span className="text-sm font-medium">
                              {item.price * item.quantity} ₽
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Подытог</span>
                          <span>{subtotal} ₽</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Доставка</span>
                          <span>{deliveryCost > 0 ? `${deliveryCost} ₽` : 'Бесплатно'}</span>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between font-bold">
                        <span>Итого</span>
                        <span className="text-primary">{total} ₽</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 space-y-4">
                      <div className="flex items-center text-sm">
                        <Truck className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          {deliveryMethod === "pickup" 
                            ? "Самовывоз из салона" 
                            : "Курьерская доставка"}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          {deliveryMethod === "pickup"
                            ? "Готово к самовывозу: сегодня после 16:00"
                            : "Ожидаемая доставка: в течение 1-2 дней"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-6">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Нужна помощь?</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Если у вас возникли вопросы по оформлению заказа, свяжитесь с нами:
                      </p>
                      <div className="text-sm">
                        <p>Телефон: +7 (123) 456-78-90</p>
                        <p>Email: info@style-salon.ru</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;