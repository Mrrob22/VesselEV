'use client'

import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import { useMemo } from 'react'

type DeviationPoint = {
    quarter: string
    actual: number
    baseline: number
    deviation: number
}

export default function VesselChart({
                                        vesselName,
                                        data,
                                    }: {
    vesselName: string
    data: DeviationPoint[]
}) {
    const options = useMemo(() => ({
        title: { text: `Deviation for ${vesselName}` },
        xAxis: {
            categories: data.map((d) => d.quarter),
        },
        yAxis: {
            title: { text: 'gCO₂/tnm' },
        },
        series: [
            {
                name: 'Actual',
                data: data.map((d) => d.actual),
            },
            {
                name: 'Baseline',
                data: data.map((d) => d.baseline),
            },
        ],
    }), [data, vesselName])

    return <HighchartsReact highcharts={Highcharts} options={options} />
}
