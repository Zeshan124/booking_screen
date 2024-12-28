"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Wrapper from "./components/Wrapper";
import Loader from "./components/Loader";

const Page = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [shops, setShops] = useState([]);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const checkLoginState = () => {
      const loggedIn = localStorage.getItem("isLoggedIn");
      if (loggedIn === "true") {
        setIsLoggedIn(true);
      } else {
        router.push("/login");
      }
      setIsLoading(false);
    };

    checkLoginState();
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("isLoggedIn");
      setIsLoggedIn(false);
      router.push("/login");
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      const fetchData = async () => {
        try {
          const ordersResponse = await fetch(
            `https://backend.qistbazaar.pk/api/finance/store-revenue?startDate=2024-11-01&endDate=2024-12-11&token=${process.env.SECRET_KEY}`
          );
          const ordersData = await ordersResponse.json();
          setOrders(ordersData?.data || []);

          const shopsResponse = await fetch(
            `https://backend.qistbazaar.pk/api/finance/store-revenue?startDate=2024-11-01&endDate=2024-12-11&token=${process.env.SECRET_KEY}`
          );
          const shopsData = await shopsResponse.json();
          setShops(shopsData?.data || []);
          <Loader />;
        } catch (error) {
          console.error("Error fetching data:", error);
          setHasError(true);
        }
      };
      fetchData();
    }
  }, [isLoggedIn]);

  if (isLoading) {
    return <Loader />;
  }

  if (hasError) {
    return <div>Error loading data...</div>;
  }

  return isLoggedIn ? (
    <div style={{ padding: "10px" }}>
      {/* <Link to="/"> */}
      <div className="navbar container d-flex align-items-center">
        <div className="d-flex align-items-center">
          <img src="/images/icons/QB-Logo.jpg" className="logo" alt="QB-Logo" />
          <h1 className="head-h1 mt-2">Finance Screen</h1>
        </div>
        <div className="logout-btn-container">
          <button onClick={handleLogout} className="logout-button">
            <img
              src="/images/icons/logout-icons.png"
              alt="Logout Icon"
              className="logout-icon"
            />
            Logout
          </button>
        </div>
      </div>
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0px",
        }}
      ></div>
      <Wrapper orders={orders} shops={shops} loading={false} />
    </div>
  ) : null;
};

export default Page;
