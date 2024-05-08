import { toast } from "react-hot-toast";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CloseIcon from "@mui/icons-material/Close";

export const toastWarning = ({ message = "" }) => {
  toast(message, {
    icon: (
      <WarningAmberIcon
        fontSize="large"
        className="border-[1px] text-orange-800 rounded-full"
      />
    ),
  });
};

export const toastError = ({ message = "" }) => {
  toast.error(message, {
    icon: (
      <CloseIcon
        fontSize="large"
        className="border-[1px] text-red-900 rounded-full"
      />
    ),
  });
};

export const toastSuccess = ({ message = "" }) => {
  toast.success(message, {
    icon: (
      <CheckCircleIcon
        fontSize="large"
        className="border-[1px] text-green-600 rounded-full"
      />
    ),
  });
};
