import { Flex } from '@chakra-ui/react';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


export const YearlyAttendanceGraph = ({data}) => {
    
    return (
        <Flex h={"100%"} w={"100%"} align={"center"} justify={"center"}>
            <BarChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 0, right: 0, left: -30, bottom: 0,
                }}
            >
                <XAxis dataKey="month" style={{ fontWeight: "bold" }} />
                <YAxis
                    style={{ fontSize: 13, fontWeight: "bold" }}
                    domain={[0, 31]}
                    ticks={[0, 5, 10, 15, 20, 25, 30]}
                />
                <Tooltip />
                <Bar dataKey="Present" fill="#9985FF" barSize={20} />
            </BarChart>
        </Flex>
    )
}