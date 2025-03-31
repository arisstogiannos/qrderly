"use client";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  calculateAvg,
  chartTimePeriod,
  formatAndGroupData,
  setDataDateRange,
} from "@/lib/chartFunctions";
import { formatCurrency } from "@/lib/formatter";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export default function Chart({
  chartData,
}: {
  chartData: {
    createdAt: Date;
    pricePaidInCents: number;
  }[];
}) {
  const [formattedChartData, setFormattedChartData] = useState<
    {
      date: string;
      income: number;
    }[]
  >([]);

  useEffect(() => {
    formatAndGroupData(chartData, false);
    setDataDateRange(
      chartData,
      chartTimePeriod.at(0)?.value.createdAfter,
      chartTimePeriod.at(0)?.value.createdBefore,
      setFormattedChartData,
    );
  }, [chartData]);

  return (
    <Card className="col-span-full row-span-1 drop-shadow-lg ">
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>Sales Report</CardTitle>
            <CardDescription className="mt-4">
              <div className="">Average Income</div>
              <div className="text-lg font-bold text-black">{formatCurrency(calculateAvg(formattedChartData))}</div>
            </CardDescription>
          </div>

          <Select
            onValueChange={(value) => {
              const jsonValue = JSON.parse(value);
              setDataDateRange(
                chartData,
                new Date(jsonValue.createdAfter),
                new Date(jsonValue.createdBefore),
                setFormattedChartData,
              );
            }}
            // defaultValue={JSON.stringify(chartTimePeriod.at(0)?.value)}
          >
            <SelectTrigger className="w-28 lg:w-40">
              <SelectValue placeholder="1 week" />
            </SelectTrigger>
            <SelectContent>
              {chartTimePeriod.map((item) => (
                <SelectItem value={JSON.stringify(item.value)} key={item.text}>
                  {item.text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="h-[200px] max-w-full text-foregroundAdmin">
        <ChartContainer
          config={chartConfig}
          className="h-full max-w-[240px] min-h-[100px] sm:max-w-full lg:min-w-full"
        >
          <BarChart
            accessibilityLayer
            data={formattedChartData}
            margin={{
              left: 0,
              right: 0,
            }}
          >
            <CartesianGrid vertical={false} className="row-span-1 w-full" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              interval={0}
              // tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent  />} />
            <Bar
              dataKey="income"
              type="natural"
              fill="var(--color-desktop)"
              strokeWidth={2}
              // dot={{
              //   fill: "var(--color-desktop)",
              // }}
              // activeDot={{
              //   r: 6,
              // }}
              radius={5}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
}
