import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

/**
 * Скелетон для карточки статистики
 */
export const StatCardSkeleton = () => (
  <Card>
    <CardContent className="p-6 flex items-center space-x-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-16 mt-1" />
        <Skeleton className="h-3 w-20 mt-1" />
      </div>
    </CardContent>
  </Card>
);

/**
 * Скелетон для графика с заголовком
 */
export const ChartSkeleton = () => (
  <Card>
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-40" />
      </div>
      <Skeleton className="h-4 w-64 mt-1" />
    </CardHeader>
    <CardContent className="pt-2">
      <Skeleton className="h-80 w-full" />
    </CardContent>
  </Card>
);

/**
 * Скелетон для списка активности
 */
export const ActivityItemSkeleton = () => (
  <div className="flex">
    <div className="mr-4 flex flex-col items-center">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="h-full w-px bg-border" />
    </div>
    <div className="space-y-1">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-56" />
      <Skeleton className="h-3 w-20" />
    </div>
  </div>
);

/**
 * Скелетон для списка записей/заказов
 */
export const ListItemSkeleton = () => (
  <div className="p-3 border border-border rounded-md">
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-40 mt-1" />
        <Skeleton className="h-3 w-24 mt-1" />
      </div>
      <div className="flex items-center">
        <div className="mr-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-16 mt-1" />
        </div>
        <Skeleton className="h-9 w-16" />
      </div>
    </div>
  </div>
);

/**
 * Главный компонент скелетона для дашборда
 */
const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-32 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
        <ChartSkeleton />
        
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48 mt-1" />
          </CardHeader>
          <CardContent className="pt-2 h-80 overflow-auto">
            <div className="space-y-6">
              <ActivityItemSkeleton />
              <ActivityItemSkeleton />
              <ActivityItemSkeleton />
              <ActivityItemSkeleton />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-8 w-24" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-2">
              <ListItemSkeleton />
              <ListItemSkeleton />
              <ListItemSkeleton />
              <ListItemSkeleton />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-8 w-24" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-2">
              <ListItemSkeleton />
              <ListItemSkeleton />
              <ListItemSkeleton />
              <ListItemSkeleton />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardSkeleton;