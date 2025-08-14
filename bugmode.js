module.exports = async function ({ conn, args, isOwner, reply }) {
  if (!isOwner) return reply("❌ Owner only.");

  if (args[0] === "on") {
    conn.bugMode = true;
    return reply("💣 Bug mode ON");
  } else if (args[0] === "off") {
    conn.bugMode = false;
    return reply("🧯 Bug mode OFF");
  } else {
    return reply("❓ Use: .bugmode on / off");
  }
};