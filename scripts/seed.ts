import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
    const vesselsRaw = await fs.readFile(path.join(__dirname, '../public/data/vessels.json'), 'utf-8')
    const logsRaw = await fs.readFile(path.join(__dirname, '../public/data/daily-log-emissions.json'), 'utf-8')
    const refsRaw = await fs.readFile(path.join(__dirname, '../public/data/pp-reference.json'), 'utf-8')

    const vessels = JSON.parse(vesselsRaw)
    const logs = JSON.parse(logsRaw)
    const refs = JSON.parse(refsRaw)

    await prisma.log.deleteMany()
    await prisma.vessel.deleteMany()
    await prisma.pPReference.deleteMany()

    for (const vessel of vessels) {
        await prisma.vessel.create({
            data: {
                id: vessel.IMONo,
                name: vessel.Name,
                type: vessel.VesselType,
            },
        })
    }

    for (const ref of refs) {
        await prisma.pPReference.create({
            data: {
                vesselTypeID: ref.VesselTypeID,
                traj: ref.Traj.trim(),
                a: ref.a,
                b: ref.b,
                c: ref.c,
                d: ref.d,
                e: ref.e,
            },
        })
    }

    for (const log of logs) {
        await prisma.log.create({
            data: {
                vesselId: log.VesselID,
                logID: BigInt(log.LOGID),
                date: new Date(log.TOUTC),
                AERCO2T2W: log.AERCO2T2W,
            },
        })
    }

    console.log('✅ Data imported successfully.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
