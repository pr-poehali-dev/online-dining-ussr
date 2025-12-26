import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Icon from "@/components/ui/icon";

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  weight: string;
  description: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const menuItems: MenuItem[] = [
  { id: 1, name: "Борщ с говядиной", category: "Первые блюда", price: 180, weight: "300г", description: "Классический борщ со сметаной" },
  { id: 2, name: "Щи кислые", category: "Первые блюда", price: 160, weight: "300г", description: "Традиционные щи из квашеной капусты" },
  { id: 3, name: "Куриный бульон с лапшой", category: "Первые блюда", price: 140, weight: "300г", description: "Домашний бульон" },
  { id: 4, name: "Котлеты по-киевски", category: "Вторые блюда", price: 280, weight: "200г", description: "С гарниром из картофельного пюре" },
  { id: 5, name: "Гуляш с гречкой", category: "Вторые блюда", price: 250, weight: "350г", description: "Тушёная говядина с гречневой кашей" },
  { id: 6, name: "Рыба жареная", category: "Вторые блюда", price: 240, weight: "200г", description: "С рисом и овощами" },
  { id: 7, name: "Сельдь под шубой", category: "Салаты", price: 150, weight: "150г", description: "Классический слоёный салат" },
  { id: 8, name: "Оливье", category: "Салаты", price: 140, weight: "150г", description: "Традиционный советский салат" },
  { id: 9, name: "Винегрет", category: "Салаты", price: 120, weight: "150г", description: "Овощной салат со свёклой" },
  { id: 10, name: "Компот из сухофруктов", category: "Напитки", price: 60, weight: "250мл", description: "Домашний компот" },
  { id: 11, name: "Кисель клюквенный", category: "Напитки", price: 70, weight: "250мл", description: "Густой кисель" },
  { id: 12, name: "Чай с лимоном", category: "Напитки", price: 50, weight: "200мл", description: "Крепкий чёрный чай" },
  { id: 13, name: "Пирожки с капустой", category: "Выпечка", price: 80, weight: "100г", description: "Печёные пирожки" },
  { id: 14, name: "Ватрушка с творогом", category: "Выпечка", price: 90, weight: "120г", description: "Сладкая ватрушка" },
  { id: 15, name: "Булочка с маком", category: "Выпечка", price: 70, weight: "80г", description: "Свежая сдоба" },
];

const categories = ["Первые блюда", "Вторые блюда", "Салаты", "Напитки", "Выпечка"];

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast({
      title: "Добавлено в корзину",
      description: item.name,
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) => prev.map((item) => item.id === id ? { ...item, quantity } : item));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredItems = selectedCategory === "all" 
    ? menuItems 
    : menuItems.filter((item) => item.category === selectedCategory);

  const handleOrderSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Заказ оформлен!",
      description: "Скоро с вами свяжется оператор",
    });
    setCart([]);
    setIsCartOpen(false);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-primary text-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent soviet-star"></div>
              <div>
                <h1 className="text-3xl font-bold">Столовая №7</h1>
                <p className="text-sm opacity-90">Блюда, как из детства</p>
              </div>
            </div>
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button variant="secondary" className="relative">
                  <Icon name="ShoppingCart" className="mr-2" />
                  Корзина
                  {cart.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-accent text-foreground">
                      {cart.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Ваш заказ</SheetTitle>
                  <SheetDescription>
                    Проверьте состав заказа и оформите доставку
                  </SheetDescription>
                </SheetHeader>
                
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                    <Icon name="ShoppingCart" size={64} className="mb-4 opacity-50" />
                    <p>Корзина пуста</p>
                  </div>
                ) : (
                  <div className="space-y-6 mt-6">
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <Card key={item.id} className="animate-fade-in">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <h3 className="font-medium">{item.name}</h3>
                                <p className="text-sm text-muted-foreground">{item.weight}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Icon name="X" size={16} />
                              </Button>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  <Icon name="Minus" size={14} />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Icon name="Plus" size={14} />
                                </Button>
                              </div>
                              <p className="font-bold">{item.price * item.quantity} ₽</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="bg-accent/20 p-4 rounded-lg">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Итого:</span>
                        <span>{totalPrice} ₽</span>
                      </div>
                    </div>

                    <form onSubmit={handleOrderSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Ваше имя</Label>
                        <Input id="name" required placeholder="Иван Иванов" />
                      </div>
                      <div>
                        <Label htmlFor="phone">Телефон</Label>
                        <Input id="phone" type="tel" required placeholder="+7 (999) 123-45-67" />
                      </div>
                      <div>
                        <Label htmlFor="address">Адрес доставки</Label>
                        <Textarea id="address" required placeholder="Улица, дом, квартира" />
                      </div>
                      <Button type="submit" className="w-full" size="lg">
                        Оформить заказ на {totalPrice} ₽
                      </Button>
                    </form>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20 soviet-pattern">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-4 animate-fade-in">Вкус детства в каждом блюде</h2>
          <p className="text-xl opacity-90 mb-8 animate-fade-in">
            Готовим по классическим рецептам советских столовых
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="animate-scale-in"
            onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Icon name="ArrowDown" className="mr-2" />
            Посмотреть меню
          </Button>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-card shadow-md sticky top-[88px] z-30">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className="whitespace-nowrap"
            >
              Всё меню
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary">Наше меню</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-xl transition-all duration-300 animate-fade-in hover-scale">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <Badge variant="secondary">{item.weight}</Badge>
                  </div>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between items-center">
                  <p className="text-2xl font-bold text-primary">{item.price} ₽</p>
                  <Button onClick={() => addToCart(item)}>
                    <Icon name="Plus" className="mr-2" size={16} />
                    В корзину
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Map & Contacts */}
      <section className="py-16 bg-secondary/10">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary">Как нас найти</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Контакты</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Icon name="MapPin" className="text-primary mt-1" />
                  <div>
                    <p className="font-medium">Адрес:</p>
                    <p className="text-muted-foreground">г. Москва, ул. Ленина, д. 7</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="Phone" className="text-primary mt-1" />
                  <div>
                    <p className="font-medium">Телефон:</p>
                    <p className="text-muted-foreground">+7 (495) 123-45-67</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="Clock" className="text-primary mt-1" />
                  <div>
                    <p className="font-medium">Режим работы:</p>
                    <p className="text-muted-foreground">Ежедневно с 9:00 до 21:00</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="Truck" className="text-primary mt-1" />
                  <div>
                    <p className="font-medium">Доставка:</p>
                    <p className="text-muted-foreground">Бесплатно при заказе от 1000 ₽</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="w-full h-[400px] bg-muted flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Icon name="Map" size={64} className="mx-auto mb-4 opacity-50" />
                    <p>Интерактивная карта</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-accent soviet-star"></div>
            <p className="text-xl font-bold">Столовая №7</p>
          </div>
          <p className="opacity-90">Вкус детства с 1977 года</p>
          <p className="text-sm opacity-75 mt-4">© 2024 Столовая №7. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}