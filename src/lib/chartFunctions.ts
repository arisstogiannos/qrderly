export const chartTimePeriod = [
  {
    text: "1 week",
    value: (() => {
      const now = new Date();
      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(now.getDate() - 6);

      return {
        createdAfter: oneWeekAgo,
        createdBefore: now,
      };
    })(),
  },
  {
    text: "1 month",
    value: (() => {
      const now = new Date();
      const oneMonthAgo = new Date(now);
      oneMonthAgo.setMonth(now.getMonth() - 1);

      return {
        createdAfter: oneMonthAgo,
        createdBefore: now,
      };
    })(),
  },
  {
    text: "6 months",
    value: (() => {
      const now = new Date();
      const oneMonthAgo = new Date(now);
      oneMonthAgo.setMonth(now.getMonth() - 6);

      return {
        createdAfter: oneMonthAgo,
        createdBefore: now,
      };
    })(),
  },
  // {
  //   text: "12 months",
  //   value: (() => {
  //     const now = new Date();
  //     const oneMonthAgo = new Date(now);
  //     oneMonthAgo.setMonth(now.getMonth() - 12);

  //     return {
  //       createdAfter: oneMonthAgo,
  //       createdBefore: now,
  //     };
  //   })(),
  // },
];

export function formatAndGroupData(
  chartData: {
    createdAt: Date;
    pricePaidInCents: number;
  }[],
  groupByMonth: boolean,
) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let formated;

  if (groupByMonth) {
    formated = chartData.map((item) => ({
      date: monthNames[new Date(item.createdAt).getMonth()],
      income: item.pricePaidInCents / 100,
    }));
  } else {
    formated = chartData.map((item) => ({
      date:
        new Date(item.createdAt).getDate() +
        "/" +
        (new Date(item.createdAt).getMonth() + 1) +
        "/" +
        new Date(item.createdAt).getFullYear(),
      income: item.pricePaidInCents / 100,
    }));
  }

  formated.reduce<
    {
      date: string;
      income: number;
    }[]
  >((acc, current) => {
    const existing = acc.find((item) => item.date === current.date);
    // const splited =current.date.split("/")
    // const joined = splited[0]+"/"+splited[1]
    // current.date = joined
    if (existing) {
      // If a record with the same date exists, sum the income
      existing.income += current.income;
    } else {
      // Otherwise, add a new record
      acc.push(current);
    }
    return acc;
  }, []);

  // const sorted = formated.toSorted((a, b) => {
  //   // Parse date strings into Date objects using the correct format
  //   const [dayA, monthA, yearA] = a.date.split("/").map(Number);
  //   const [dayB, monthB, yearB] = b.date.split("/").map(Number);

  //   const dateA = new Date(yearA, monthA - 1, dayA).getTime(); // Create Date objects
  //   const dateB = new Date(yearB, monthB - 1, dayB).getTime();

  //   return dateA - dateB; // Subtract to sort in ascending order
  // });

  return formated;
}

export function setDataDateRange(
  chartData: {
    createdAt: Date;
    pricePaidInCents: number;
  }[],
  createdAfter: Date | null | undefined,
  createdBefore: Date | null | undefined,
  setFormattedChartData: any,
) {
  // If no range is provided, default to entire dataset range
  const startDate =
    createdAfter ||
    new Date(Math.min(...chartData.map((d) => d.createdAt.getTime())));
  const endDate =
    createdBefore ||
    new Date(Math.max(...chartData.map((d) => d.createdAt.getTime())));

  const distanceBetweenDates =
    endDate.getMonth() < startDate.getMonth()
      ? endDate.getMonth() + 12 - startDate.getMonth()
      : endDate.getMonth() - startDate.getMonth();

  // Create an array of all dates between startDate and endDate
  const dateRange = createDateRange(
    startDate,
    endDate,

    distanceBetweenDates,
  );

  const formattedChartData = formatAndGroupData(
    chartData,
    distanceBetweenDates > 2,
  );
  const fullData = dateRange.map((date) => {
    const existing = formattedChartData.find((d) => d.date === date);
    return {
      date,
      income: existing ? existing.income : 0, // Use income if it exists, otherwise 0
    };
  });

  // const filtered = chartData.filter(
  //   (item) => ((createdAfter ? (item.createdAt >= createdAfter) : true) && (createdBefore ? (item.createdAt <= createdBefore):true) ) && item
  // );
  if (distanceBetweenDates < 2) {
    const croped = cropYear(fullData);
    setFormattedChartData(croped);
  } else {
    setFormattedChartData(fullData);
  }
  // formatAndGroupData(filtered, setFormattedChartData);
}

// Utility export function to create an array of dates between two dates
export function createDateRange(
  start: Date,
  end: Date,
  distanceBetweenDates: number,
): string[] {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dateArray: string[] = [];
  const currentDate = new Date(start);
  if (!(distanceBetweenDates > 2)) {
    while (currentDate <= end) {
      dateArray.push(
        currentDate.getDate() +
          "/" +
          (currentDate.getMonth() + 1) +
          "/" +
          currentDate.getFullYear(),
      );
      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }
  } else {
    for (
      let i = start.getMonth() + 1;
      i <= start.getMonth() + distanceBetweenDates;
      i++
    ) {
      dateArray.push(monthNames[i % 12]);
    }
  }
  return dateArray;
}

// Utility export function to check if two dates are the same day
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function cropYear(
  data: {
    date: string;
    income: number;
  }[],
) {
  data.map((item) => {
    const splited = item.date.split("/");
    const joined = splited[0] + "/" + splited[1];

    item.date = joined;
  });

  return data;
}

export function calculateAvg(data: {
  date: string;
  income: number;
}[]) {
  const sum = data.reduce((acc, item) => acc + item.income, 0);
  return sum / data.length;
}