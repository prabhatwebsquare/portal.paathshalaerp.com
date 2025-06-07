import { CustomSelect } from "@/common/CustomSelect";
import { PageHeader } from "@/common/PageHeader";
import { STATUS } from "@/constant";
import { useAdditionalSetupStore } from "@/store/additionalSetup";
import { useTransportStore } from "@/store/Transport";
import { map } from "lodash";
import React, { useEffect, useState } from "react";

function TransportReportList({ themeColor, sessionMasterId }) {
  const [inputValue, setInputValue] = useState({});
  const { getRouteAction, getRouteStatus, allRoutes } = useTransportStore(
    (s) => ({
      getRouteAction: s.getRouteAction,
      getRouteStatus: s.getRouteStatus,
      allRoutes: s.allRoutes,
    })
  );
  const { getRouteByIdAction, getShiftByIdStatus, SingleRouteDetail } =
    useAdditionalSetupStore((s) => ({
      getRouteByIdAction: s.getRouteByIdAction,
      getShiftByIdStatus: s.getShiftByIdStatus,
      SingleRouteDetail: s.SingleRouteDetail,
    }));
  useEffect(() => {
    if ((getRouteStatus || 1) === STATUS.NOT_STARTED) {
      getRouteAction({ sessionMasterId });
    }
  }, [getRouteAction, getRouteStatus, sessionMasterId]);

  useEffect(() => {
    const data = {
      transportRouteId: inputValue.transportRouteId,
      sessionMasterId,
    };
    if (!inputValue.transportRouteId) {
      return;
    }
    getRouteByIdAction(data);
  }, [inputValue.transportRouteId]);
  return (
    <div>
      <PageHeader heading={"Report"} />
    </div>
  );
}

export default TransportReportList;
