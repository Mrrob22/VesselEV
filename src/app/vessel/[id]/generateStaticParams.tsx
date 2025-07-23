import { prisma } from '@/lib/prisma'

export async function generateStaticParams() {
    const vessels = await prisma.vessel.findMany({
        select: { id: true },
    })

    return vessels.map((vessel) => ({
        id: vessel.id.toString(),
    }))
}
