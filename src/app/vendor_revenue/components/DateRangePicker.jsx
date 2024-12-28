"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const { RangePicker } = DatePicker;

const DateRangePicker = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedDates, setSelectedDates] = useState([]);

  useEffect(() => {
    const today = dayjs();
    const lastWeek = today.subtract(7, "days");

    setSelectedDates([lastWeek, today]);
  }, []);

  const handleDateChange = (dates, dateStrings) => {
    setSelectedDates(dates);

    const storeID = searchParams.get("storeID");
    const [startDate, endDate] = dateStrings;

    const query = new URLSearchParams(searchParams);

    if (storeID) query.set("storeID", storeID);
    if (startDate) query.set("startDate", startDate);
    if (endDate) query.set("endDate", endDate);

    router.push(`?${query.toString()}`);
  };

  return (
    <RangePicker
      value={selectedDates}
      onChange={handleDateChange}
      format="YYYY-MM-DD"
    />
  );
};

export default DateRangePicker;
