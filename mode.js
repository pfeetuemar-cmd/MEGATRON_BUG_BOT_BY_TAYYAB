module.exports = async function ({ conn, command, isOwner, reply }) {
  if (!isOwner) return reply("❌ Only Bot Owner can use this command.");

  if (command === "self") {
    conn.public = false;
    return reply("🔒 Private mode activated.");
  }

  if (command === "public") {
    conn.public = true;
    return reply("🌍 Public mode activated.");
  }
};