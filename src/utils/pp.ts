import { PPReference } from '@prisma/client'
import Decimal from 'decimal.js'

type CleanReference = Omit<PPReference, 'id' | 'vesselTypeID'>

type CalculatePPBaselinesArgs = {
    factors: PPReference[]
    year: number
    DWT: Decimal
}

type PPBaselines = {
    min: Decimal
    striving: Decimal
    yxLow: Decimal
    yxUp: Decimal
}

const yxLowF = 0.33
const yxUpF = 1.67

const emptyFactor: CleanReference = {
    traj: '',
    a: 0,
    b: 0,
    c: 0,
    d: 0,
    e: 0,
}

export const calculatePPSCCBaselines = ({
                                            factors,
                                            year,
                                            DWT,
                                        }: CalculatePPBaselinesArgs): PPBaselines => {
    const { minFactors, strFactors } = factors.reduce<{
        minFactors: CleanReference
        strFactors: CleanReference
    }>(
        (acc, cur) => {
            const key = (() => {
                switch (cur.traj?.trim()) {
                    case 'MIN':
                        return 'minFactors'
                    case 'STR':
                        return 'strFactors'
                    default:
                        return null
                }
            })()

            if (!key) return acc

            return {
                ...acc,
                [key]: cur,
            }
        },
        { minFactors: emptyFactor, strFactors: emptyFactor },
    )

    const min = calculatePPSCCBaseline({ factors: minFactors, year, DWT })
    const striving = calculatePPSCCBaseline({ factors: strFactors, year, DWT })
    const yxLow = Decimal.mul(min, yxLowF)
    const yxUp = Decimal.mul(min, yxUpF)

    return {
        min,
        striving,
        yxLow,
        yxUp,
    }
}

type CalculateBaselineArgs = {
    factors: CleanReference
    year: number
    DWT: Decimal
}

const calculatePPSCCBaseline = ({
                                    factors,
                                    year,
                                    DWT,
                                }: CalculateBaselineArgs) =>
    Decimal.mul(
        Decimal.sum(
            Decimal.mul(factors.a ?? 0, Decimal.pow(year, 3)),
            Decimal.mul(factors.b ?? 0, Decimal.pow(year, 2)),
            Decimal.mul(factors.c ?? 0, year),
            factors.d ?? 0,
        ),
        Decimal.pow(DWT, factors.e ?? 0),
    )
