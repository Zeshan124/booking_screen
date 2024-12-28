"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import DataTable from "./Table";
import Dropdown from "./Dropdown";
import { showAlertMessage } from "../components/CommonFunctionalities";
import CustomTabs from "./Tab";
import Loader from "./Loader";

const Wrapper = ({ orders, shops }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [shopOrders, setShopOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const storeID = searchParams.get("storeID");
    const filtered = storeID
      ? orders.filter((order) => String(order.storeID) === String(storeID))
      : orders;
    setFilteredOrders(filtered);
  }, [searchParams, orders]);

  const fetchShopOrders = async (storeUrl) => {
    setOrderLoading(true);
    setShopOrders([]);
    setSelectedShop(storeUrl);

    try {
      const API_URL = `https://backend.qistbazaar.pk/api/finance/store/order-detail`;
      const queryParams = new URLSearchParams({
        token: process.env.SECRET_KEY,
        _start: "1",
        _limit: "30",
        storeUrl,
      });

      const response = await fetch(`${API_URL}?${queryParams.toString()}`);
      const data = await response.json();

      if (data.success && data.data.length > 0) {
        setShopOrders(data.data);
        showAlertMessage("Data fetched successfully!", "success");
      } else {
        setShopOrders([]);
        showAlertMessage("No data found for this shop.", "fail");
      }
    } catch (error) {
      console.error("API Error:", error);
      setShopOrders([]);
      showAlertMessage("An error occurred while fetching data.", "fail");
    } finally {
      setOrderLoading(false);
    }
  };

  const handleStoreSelect = (selectedStoreID) => {
    const storeIndex = shops.findIndex(
      (shop) => shop.storeID === selectedStoreID
    );
    if (storeIndex !== -1) {
      setActiveTab(storeIndex);
      fetchShopOrders(shops[storeIndex].shopUrl);
    }
  };

  // const columns = [
  //     { title: "Store ID", dataIndex: "storeID", key: "storeID" },
  //     { title: "Shop Name", dataIndex: "ShopName", key: "ShopName" },
  //     {
  //         title: "Shop URL",
  //         dataIndex: "shopUrl",
  //         key: "shopUrl",
  //         render: (shopUrl, record) => (
  //             <a
  //                 href="#"
  //                 onClick={(e) => {
  //                     e.preventDefault();
  //                     fetchShopOrders(shopUrl); // Fetch orders when clicking on Shop URL
  //                 }}
  //                 style={{
  //                     color: "#007bff",
  //                     cursor: "pointer",
  //                     textDecoration: "none",
  //                 }}
  //             >
  //                 {shopUrl}
  //             </a>
  //         ),
  //     },
  //     { title: "City", dataIndex: "city", key: "city" },
  //     {
  //         title: "Revenue",
  //         dataIndex: "Revenue",
  //         key: "Revenue",
  //         render: (revenue) => (
  //             <span>{revenue === 0 ? "No Revenue" : revenue}</span>
  //         ),
  //     },
  // ];

  useEffect(() => {
    if (shops && shops.length > 0) {
      const firstShopUrl = shops[0]?.shopUrl;
      fetchShopOrders(firstShopUrl);
    }
  }, [shops]);

  const orderColumns = [
    { title: "Order ID", dataIndex: "orderID", key: "orderID" },
    { title: "Product Names", dataIndex: "productNames", key: "productNames" },
    {
      title: "Product Image",
      dataIndex: "productImage",
      key: "productImage",
      render: (productImage) => {
        if (productImage) {
          const imageUrl = productImage.startsWith("http")
            ? productImage
            : `https://backend.qistbazaar.pk/${productImage}`;

          return <img src={imageUrl} alt="Product Image" width={100} />;
        }
        return <span>No Image</span>;
      },
    },
    { title: "Month", dataIndex: "month", key: "month" },
    {
      title: "Installment Amount",
      dataIndex: "installmentAmount",
      key: "installmentAmount",
      render: (value) => (value ? value.toLocaleString() : "N/A"),
    },
    {
      title: "Advance Amount",
      dataIndex: "advanceAmount",
      key: "advanceAmount",
      render: (value) => (value ? value.toLocaleString() : "N/A"),
    },
    {
      title: "Vendor Cost",
      dataIndex: "productCost",
      key: "productCost",
      render: (value) => (value ? value.toLocaleString() : "N/A"),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (value) => (value ? value.toLocaleString() : "N/A"),
    },
  ];

  return (
    <div className="wrapper-main">
      <Dropdown
        shops={shops}
        onStoreSelect={handleStoreSelect}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        style={{ justifyContent: "flex-end" }}
      />
      <CustomTabs
        tabData={shops}
        selected={activeTab}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        fetchShopOrders={fetchShopOrders}
      />
      {orderLoading && <Loader />}
      {shopOrders.length > 0 ? (
        <div style={{ marginTop: "20px" }}>
          <DataTable
            orders={shopOrders}
            loading={orderLoading}
            columns={orderColumns}
          />
        </div>
      ) : (
        !orderLoading &&
        selectedShop && (
          <div style={{ marginTop: "20px" }}>
            <p style={{ textAlign: "center", color: "#999" }}>
              No orders available for this shop.
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default Wrapper;
