const fs = require("fs");
const dbPath = "./database/autogreet.json";

// 🔧 Clean JID helper
const getCleanNumber = (jid) => jid ? jid.replace(/\D/g, "") : null;

module.exports = async function ({ conn, m, args, isGroup, reply }) {
  if (!isGroup) return reply("❌ This command only works in *groups*.");

  // 🔐 Check if sender is BOT OWNER
  const sender = getCleanNumber(m.sender || m.key?.participant || m.key?.remoteJid);
  const owners = Array.isArray(global.owner)
    ? global.owner.map(n => n.replace(/\D/g, ""))
    : [global.owner.toString().replace(/\D/g, "")];
  const isOwner = owners.includes(sender);

  if (!isOwner) {
    return reply("🔒 *Only BOT OWNER can use this command.*\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦️ ✓");
  }

  // 📂 Load or initialize greet DB
  let greetDB = {};
  if (fs.existsSync(dbPath)) {
    try {
      greetDB = JSON.parse(fs.readFileSync(dbPath));
    } catch (e) {
      greetDB = {};
    }
  }

  const groupId = m.chat;
  const status = args[0]?.toLowerCase();

  if (!["on", "off"].includes(status)) {
    return reply(
      "🔁 *Usage:* `.autogreet on` or `.autogreet off`\n\nEnables or disables auto greeting in this group."
    );
  }

  // ✅ Update Setting
  if (status === "on") {
    greetDB[groupId] = true;
    reply(
      `✅ *Auto Greet Enabled for this Group!*\n\n📺 *YT:* youtube.com/@demoneye_official\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦️ ✓`
    );
  } else {
    delete greetDB[groupId];
    reply(
      `❌ *Auto Greet Disabled for this Group!*\n\n📺 *YT:* youtube.com/@demoneye_official\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦️ ✓`
    );
  }

  fs.writeFileSync(dbPath, JSON.stringify(greetDB, null, 2));
};