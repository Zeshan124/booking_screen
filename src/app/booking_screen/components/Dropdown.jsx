"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Select } from "antd";
import DateRangePicker from "../../vendor_revenue/components/DateRangePicker";

const { Option } = Select;

const Dropdown = ({ shops, onStoreSelect, setActiveTab }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedShop, setSelectedShop] = useState(null);

  useEffect(() => {
    const storeID = searchParams.get("storeID") || "";
    if (storeID) {
      const selectedShopData = shops.find((shop) => shop.storeID === storeID);
      setSelectedShop(selectedShopData || null);
    } else {
      setSelectedShop(null);
    }
  }, []);

  const handleStoreChange = (storeID) => {
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const query = new URLSearchParams();
    if (storeID) query.set("storeID", storeID);
    if (startDate) query.set("startDate", startDate);
    if (endDate) query.set("endDate", endDate);

    router.push(`?${query.toString()}`);

    const selectedShopData = shops.find((shop) => shop.storeID === storeID);
    setSelectedShop(selectedShopData || null);

    if (onStoreSelect) {
      onStoreSelect(storeID);
    }

    const selectedStoreIndex = shops.findIndex(
      (shop) => shop.storeID === storeID
    );
    setActiveTab(selectedStoreIndex);
  };

  const placeholderText = selectedShop?.ShopName || "Search stores...";

  return (
    <div className="select-class">
      <label className="store-select" htmlFor="store-select">
        Select Cashier:
      </label>

      <Select
        showSearch
        value={selectedShop?.storeID || undefined}
        placeholder={placeholderText}
        onChange={handleStoreChange}
        style={{ width: 300, marginBottom: "10px" }}
        optionFilterProp="children"
        filterOption={(input, option) => {
          const childrenText = option.children?.toString() ?? "";
          return childrenText.toLowerCase().includes(input.toLowerCase());
        }}
      >
        {shops && shops.length > 0 ? (
          shops.map((shop) => (
            <Option key={shop.storeID} value={shop.storeID}>
              {shop.ShopName}
            </Option>
          ))
        ) : (
          <Option disabled>No Stores Available</Option>
        )}
      </Select>
      <DateRangePicker />
    </div>
  );
};

export default Dropdown;
