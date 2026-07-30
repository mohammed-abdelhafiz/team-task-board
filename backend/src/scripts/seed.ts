import "dotenv/config";
import { connectDB } from "@/config/db";
import User from "@/models/user.model";
import { UserRole } from "@/constants/enums";

async function seed() {
  await connectDB();
  const accounts = [
    { fullName: "Demo Admin", email: "admin@example.com", password: "Admin123!", role: UserRole.ADMIN },
    { fullName: "Demo Member", email: "member@example.com", password: "Member123!", role: UserRole.MEMBER },
  ];

  for (const account of accounts) {
    const existing = await User.findOne({ email: account.email });
    if (existing) {
      existing.fullName = account.fullName;
      existing.role = account.role;
      existing.password = account.password;
      await existing.save();
    } else {
      await User.create(account);
    }
  }
  console.log("Seeded demo admin and member accounts.");
  process.exit(0);
}

seed().catch((error) => { console.error(error); process.exit(1); });
