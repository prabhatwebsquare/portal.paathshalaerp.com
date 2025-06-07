import MonthlystaffAttendance from '@/components/Student/MonthlystaffAttendance'
import { MainLayout } from '@/layout/MainLayout'
import React from 'react'

function index() {
  return (
    <MainLayout>
        <MonthlystaffAttendance />
    </MainLayout>
  )
}

export default index