"use client";

import TeacherLeaveRequest from "@/components/Admin/TeacherLeaveRequest";
import { MainLayout } from "@/layout/MainLayout";
import { useAdminStore } from "@/store/AdminStore";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { useEffect, useMemo, useState } from "react";

export default function Page() {
  const themeColor = useMemo(() => getLocalStorageItem("themeColor"), []);
  const sessionMasterId = useMemo(
    () => getLocalStorageItem("sessionMasterId"),
    []
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);



  const { gatTeacherLeaveAction, LeaveRequest, gatTeacherLeaveStatus  , updateTeacherLeaveAction , updateTeacherLeaveStatus} =
    useAdminStore((s) => ({
      gatTeacherLeaveAction: s.gatTeacherLeaveAction,
      LeaveRequest: s.LeaveRequest,
      gatTeacherLeaveStatus: s.gatTeacherLeaveStatus,
      updateTeacherLeaveAction :s.updateTeacherLeaveAction,
      updateTeacherLeaveStatus :s.updateTeacherLeaveStatus
    }));

  const fetchLeaveRequests = (page) => {
    gatTeacherLeaveAction({
      page,
      limit: 1, // Define the number of items per page
      status: 0, // You can change this as per your need
      sessionMasterId,
    });
  };

  const handleApprove = (id) => {
    updateTeacherLeaveAction({
      id,
      status: 1, // Approve
    })
  };

  const handleReject = (id) => {
    updateTeacherLeaveAction({
      id,
      status: 2, // decline
    })
  };
  useEffect(() => {
    fetchLeaveRequests(currentPage);
  }, [currentPage, sessionMasterId]);

  useEffect(() => {
    // Set the total pages after fetching data
    if (LeaveRequest && LeaveRequest.length > 0) {
      setTotalPages(Math.ceil(LeaveRequest.length / 2)); // Adjust as per your backend response
    }
  }, [LeaveRequest]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <MainLayout>
      <TeacherLeaveRequest
        themeColor={themeColor}
        data={LeaveRequest}
        onApprove={handleApprove}
        onReject={handleReject}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </MainLayout>
  );
}
