import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ToastProps {
  isSuccess: boolean;
}
const Toast: React.FC<ToastProps> = ({ isSuccess }) => {
  if (isSuccess) {
    toast.success("Success!", {
      autoClose: 3000, // Close the toast after 3 seconds
    });
  } else {
    toast.error("Reverted!", {
      autoClose: 3000, // Close the toast after 3 seconds
    });
  }

  return <ToastContainer />;
};

export default Toast;
