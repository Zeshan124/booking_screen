"use client";

import { Table, Form, Input, Popconfirm, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import React, { useState, useRef, useEffect, useContext } from "react";
import "./GeneralStyling.css";
import "bootstrap/dist/css/bootstrap.min.css";

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[{ required: true, message: `${title} is required.` }]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const DataTable = ({
  orders,
  loading,
  columns,
  rowKey = "orderID",
  onRowSave,
  onRowDelete, // Add the onRowDelete prop
}) => {
  const handleSave = (row) => {
    if (onRowSave) onRowSave(row);
  };

  const handleDelete = async (key) => {
    try {
      // Show loading message
      message.loading({ content: "Deleting...", key });

      // API URL for deletion (Replace with your actual API URL)
      const API_URL = `https://yourapiurl.com/deleteOrder`;

      // Make the API call for deletion
      const response = await fetch(`${API_URL}?orderID=${key}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        // If deletion was successful, update the state and remove the row from the table
        onRowDelete(key); // Trigger the deletion on frontend
        message.success({ content: "Order deleted successfully!", key });
      } else {
        message.error({
          content: "Failed to delete order. Please try again.",
          key,
        });
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      message.error({
        content: "An error occurred. Please try again later.",
        key,
      });
    }
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const editableColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div className="container mt-4">
      <div className="table-responsive">
        <Table
          components={components}
          rowClassName={() => "editable-row"}
          columns={[...editableColumns]}
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
