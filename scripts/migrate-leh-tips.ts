import dbConnect from "../lib/db";
import LehTip from "../lib/models/LehTip";

async function migrate() {
    await dbConnect();
    console.log("Connected to database. Starting migration...");

    const result = await LehTip.updateMany(
        { order: 0 },
        { $set: { order: 1 } }
    );

    console.log(`Migration complete. Updated ${result.modifiedCount} documents.`);
    process.exit(0);
}

migrate().catch(err => {
    console.error("Migration failed:", err);
    process.exit(1);
});
