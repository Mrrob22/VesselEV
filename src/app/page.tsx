import Link from 'next/link'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function HomePage() {
    const vessels = await prisma.vessel.findMany({
        select: {
            id: true,
            name: true,
        },
    })

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Vessels List</h1>
            <ul className="space-y-2">
                {vessels.map((vessel) => (
                    <li key={vessel.id}>
                        <Link
                            className="text-blue-600 hover:underline"
                            href={`/vessel/${vessel.id}`}
                        >
                            {vessel.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}