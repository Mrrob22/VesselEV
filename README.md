# Vessel Emissions Dashboard

A simple dashboard to visualize CO₂ emissions data for vessels.

It compares actual emissions from logs against Poseidon Principles baselines and displays the results in a chart.

## 🚀 How to Run

1. Make sure you have **PostgreSQL** installed.
2. Clone the project and install dependencies:

```bash
npm install
```

3. Set up your `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/vessel"
```

4. Run the migrations and seed the data:

```bash
npx prisma migrate dev
npx tsx scripts/seed.ts
```

5. Start the dev server:

```bash
npm run dev
```

---

Visit [http://localhost:3000](http://localhost:3000) to check it out.
