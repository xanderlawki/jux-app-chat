const dbConnect = require("@/lib/mongodb");
const Chatroom = require("@/models/Chatroom");

async function seedChatrooms() {
  await dbConnect();

  const chatrooms = [
    { name: "General" },
    { name: "Sports" },
    { name: "Technology" },
    { name: "Gaming" },
    { name: "Music" },
  ];

  for (const room of chatrooms) {
    const exists = await Chatroom.findOne({ name: room.name });
    if (!exists) {
      await Chatroom.create(room);
    }
  }

  console.log("Chatrooms seeded successfully!");
  process.exit();
}

seedChatrooms().catch((err) => {
  console.error(err);
  process.exit(1);
});
