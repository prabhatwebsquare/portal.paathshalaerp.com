import { Button, Icon, Tooltip } from "@chakra-ui/react";
import { MdSms, MdCheckCircle, MdHourglassEmpty, MdCancel } from "react-icons/md";
import { motion } from "framer-motion";

const MotionButton = motion(Button);

const BulkSmsButton = ({ status, onSmsModalOpen, themeColor }) => {
  let icon, text, colorScheme, tooltipLabel;

  switch (status) {
    case 2: // Approved
      icon = MdCheckCircle;
      text = "SMS Activated";
      colorScheme = "green";
      tooltipLabel = "Your plan is active. Send bulk SMS now.";
      break;
    case 1: // Pending
      icon = MdHourglassEmpty;
      text = "Pending Approval";
      colorScheme = "orange";
      tooltipLabel = "Your plan is pending approval.";
      break;
    case 0: // Never purchased
    default:
      icon = MdCancel;
      text = "Buy SMS Plan";
      colorScheme = "red";
      tooltipLabel = "You haven't purchased an SMS plan yet.";
      break;
  }

  return (
    <Tooltip label={tooltipLabel} hasArrow>
      <MotionButton
        leftIcon={<Icon as={icon} boxSize={5} />}
        colorScheme={colorScheme}
        onClick={onSmsModalOpen}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {text}
      </MotionButton>
    </Tooltip>
  );
};

export default BulkSmsButton;