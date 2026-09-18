import { db } from './db'

export async function seedDatabase() {
  console.log('Seeding GasyHandeha initial data...')

  // 1. Ports
  const toamasina = await db.orm.public.Port.create({
    name: 'Port de Toamasina',
    code: 'TOA',
    city: 'Toamasina',
  })

  const sainteMarie = await db.orm.public.Port.create({
    name: 'Port d’Ambodifotatra',
    code: 'STM',
    city: 'Sainte-Marie',
  })

  const maroantsetra = await db.orm.public.Port.create({
    name: 'Port de Maroantsetra',
    code: 'MAR',
    city: 'Maroantsetra',
  })

  // 2. Maritime Company
  const company = await db.orm.public.Company.create({
    name: 'Melissa Express',
    slug: 'melissa-express',
    email: 'contact@melissa-express.mg',
    phone: '+261 34 00 000 00',
    address: 'Port Fluvial, Toamasina, Madagascar',
  })

  // 3. Boats
  const boat1 = await db.orm.public.Boat.create({
    name: 'Melissa I',
    companyId: company.id,
    capacity: 40,
    status: 'ACTIVE',
  })

  const boat2 = await db.orm.public.Boat.create({
    name: 'Melissa II',
    companyId: company.id,
    capacity: 60,
    status: 'ACTIVE',
  })

  // 4. Routes
  const routeToaStm = await db.orm.public.Route.create({
    originPortId: toamasina.id,
    destinationPortId: sainteMarie.id,
    distanceKm: 150,
    estimatedMinutes: 180,
  })

  const routeToaMar = await db.orm.public.Route.create({
    originPortId: toamasina.id,
    destinationPortId: maroantsetra.id,
    distanceKm: 280,
    estimatedMinutes: 360,
  })

  console.log('Seed completed successfully!', {
    company: company.name,
    boats: [boat1.name, boat2.name],
    routes: [routeToaStm.id, routeToaMar.id],
  })
}
