"use client";

import { Table } from "antd";
import "./GeneralStyling.css";
import "bootstrap/dist/css/bootstrap.min.css";

const DataTable = ({ orders, loading, columns, rowKey = "storeID" }) => {
  return (
    <div className="container mt-4">
      <div className="table-responsive">
        <Table
          columns={columns}
          dataSource={orders}
          loading={loading}
          rowKey={rowKey}
          className="custom-table table-striped table-bordered"
        />
      </div>
    </div>
  );
};

export default DataTable;
