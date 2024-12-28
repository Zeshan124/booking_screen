export const showAlertMessage = (message, type) => {
  let color = "";
  switch (type) {
    case "success":
      color = "#4caf50";
      break;
    case "fail":
      color = "#f44336";
      break;
    default:
      color = "#333";
      break;
  }

  const alertDiv = document.createElement("div");
  alertDiv.textContent = message;

  alertDiv.style.position = "fixed";
  alertDiv.style.top = "5%";
  alertDiv.style.left = "50%";
  alertDiv.style.transform = "translate(-50%, -50%)";
  alertDiv.style.color = "#fff";
  alertDiv.style.backgroundColor = color;
  alertDiv.style.padding = "10px 20px";
  alertDiv.style.borderRadius = "8px";
  alertDiv.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
  alertDiv.style.fontSize = "16px";
  alertDiv.style.fontWeight = "bold";
  alertDiv.style.textAlign = "center";
  alertDiv.style.zIndex = "9999";

  document.body.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.remove();
  }, 2500);
};
