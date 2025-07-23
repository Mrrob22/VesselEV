import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getQuarterDeviations } from '@/utils/deviation'
import VesselChart from '@/components/VesselChart'

export default async function VesselPage({ params }: { params: { id: string } }) {
    const vesselId = Number(params.id)

    if (isNaN(vesselId)) return notFound()

    const vessel = await prisma.vessel.findUnique({
        where: { id: vesselId },
        select: {
            id: true,
            name: true,
            dwt: true,
            type: true,
        },
    })

    if (!vessel) return notFound()

    const deviations = await getQuarterDeviations(vessel.id)

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">{vessel.name}</h1>
            <VesselChart vesselName={vessel.name} data={deviations} />
        </div>
    )
}
