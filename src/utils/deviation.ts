import { PrismaClient } from '@prisma/client'
import { calculatePPSCCBaselines } from './pp'
import Decimal from 'decimal.js'

const prisma = new PrismaClient()

type QuarterDeviation = {
    quarter: string
    actual: number
    baseline: number
    deviation: number
}

export async function getQuarterDeviations(vesselId: number): Promise<QuarterDeviation[]> {
    const vessel = await prisma.vessel.findUnique({
        where: { id: vesselId },
    })

    if (!vessel) throw new Error('Vessel not found')

    const logs = await prisma.log.findMany({
        where: { vesselId },
        orderBy: { date: 'asc' },
    })

    if (logs.length === 0) return []

    const logsByQuarter = new Map<string, typeof logs[number]>()

    for (const log of logs) {
        const date = new Date(log.date)
        const year = date.getUTCFullYear()
        const month = date.getUTCMonth()
        const quarter = `Q${Math.floor(month / 3) + 1}-${year}`

        const current = logsByQuarter.get(quarter)
        if (!current || log.date > current.date) {
            logsByQuarter.set(quarter, log)
        }
    }

    const refs = await prisma.pPReference.findMany({
        where: {
            vesselTypeID: vessel.type,
        },
    })

    const result: QuarterDeviation[] = []

    for (const [quarter, log] of logsByQuarter.entries()) {
        const year = new Date(log.date).getUTCFullYear()

        const { min } = calculatePPSCCBaselines({
            factors: refs,
            year,
            DWT: new Decimal(50000),
        })

        const actual = new Decimal(log.AERCO2T2W)
        const deviation = actual.sub(min).div(min).mul(100).toNumber()

        result.push({
            quarter,
            actual: actual.toNumber(),
            baseline: min.toNumber(),
            deviation: +deviation.toFixed(2),
        })
    }

    return result
}