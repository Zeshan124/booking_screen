import React, { useEffect } from "react";
import { Tabs, Tab } from "react-tabs-scrollable";
import "react-tabs-scrollable/dist/rts.css";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { FaShopLock } from "react-icons/fa6";
import { useRouter, useSearchParams } from "next/navigation";

export default function CustomTabs({
  tabData,
  selected,
  fetchShopOrders,
  activeTab,
  setActiveTab,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const storeID = searchParams.get("storeID");
    if (storeID) {
      const storeIndex = tabData.findIndex((shop) => shop.storeID === storeID);
      if (storeIndex !== -1) {
        setActiveTab(storeIndex);
      }
    }
  }, [searchParams, tabData, setActiveTab]);

  const handleTabClick = (e, index) => {
    setActiveTab(index);
    const storeUrl = tabData[index]?.shopUrl;
    if (fetchShopOrders && storeUrl) {
      fetchShopOrders(storeUrl);
    }

    const newStoreID = tabData[index]?.storeID;
    if (newStoreID) {
      const query = new URLSearchParams(searchParams.toString());
      query.set("storeID", newStoreID);
      router.push(`?${query.toString()}`);
    }
  };

  return (
    <div className="mb-4">
      <Tabs
        activeTab={activeTab}
        className="text-[#3a3541]"
        onTabClick={handleTabClick}
        hideNavBtnsOnMobile={false}
        leftBtnIcon={<FiChevronLeft size={"1.5em"} className="" />}
        rightBtnIcon={<FiChevronRight size={"1.5em"} />}
      >
        {tabData?.map((item, index) => (
          <Tab key={index} className="tabs-container">
            <div className="flex items-center justify-center min-w-[130px]">
              <FaShopLock className="mb-[0.25rem] text-[2rem] mr-2" />
              <div>
                <div>{item?.ShopName}</div>
                <div>{item["Revenue"]}</div>
              </div>
            </div>
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
