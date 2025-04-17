"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "../chart";
import { useTranslations } from 'next-intl';

interface AnalyticsChartsProps {
  visitData: { name: string; visits: number }[];
  orderData: { name: string; orders: number }[] | null;
  menuItemData: { name: string; value: number }[] | null;
  totalScans?:number
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function AnalyticsCharts({
  orderData,
  menuItemData,
  visitData,
  totalScans
}: AnalyticsChartsProps) {
  const t = useTranslations('dashboard');

  return orderData && menuItemData ? (
    <Tabs defaultValue="visits">
      <TabsList>
        <TabsTrigger value="visits">{t('menuVisits')}</TabsTrigger>
        <TabsTrigger value="orders">{t('orders')}</TabsTrigger>
        <TabsTrigger value="items">{t('popularItems')}</TabsTrigger>
      </TabsList>
      <TabsContent value="visits" className="mt-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={visitData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="visits"
                stroke="#8884d8"
                fill="#8884d8"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
      <TabsContent value="orders" className="mt-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={orderData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
      <TabsContent value="items" className="mt-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={menuItemData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {menuItemData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
    </Tabs>
  ) : (
    <div className="h-[300px] ">
     {totalScans && <p className="font-medium text-lg mb-5">{t('totalScans')+": "+totalScans}</p>}
      <ResponsiveContainer width="100%" height="90%" className={"-translate-x-8"}>
        <AreaChart data={visitData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="visits"
            stroke="#8884d8"
            fill="#8884d8"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
