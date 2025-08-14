const fs = require("fs");
const path = require("path");

// 📍 Path to selfmode.json
const configPath = path.join(__dirname, "media", "selfmode.json");

// 📤 Get clean number
function getCleanNumber(jid) {
  return jid ? jid.replace(/\D/g, "") : null;
}

module.exports = {
  command: ["public"],
  run: async ({ m, conn, reply }) => {
    try {
      // ✅ Load Bot Number
      const botJid = conn.user?.id || "";
      const botNumber = getCleanNumber(botJid);

      // 📤 Load Sender Number
      const senderJid = m.key?.participant || m.key?.remoteJid || "";
      const senderNum = getCleanNumber(senderJid);

      console.log("🧠 [DEBUG] Bot:", botNumber);
      console.log("📤 [DEBUG] Sender:", senderNum);

      // 🗂️ Check if file exists
      if (!fs.existsSync(configPath)) {
        return reply("❌ *selfmode.json file not found!*\nUse `.self` command first to activate self mode.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
      }

      const data = JSON.parse(fs.readFileSync(configPath));
      console.log("📁 [DEBUG] Current selfmode.json:", data);

      // 🔐 Match sender with owner
      if (senderNum !== data.owner_sender) {
        return reply("🚫 *You're not my Owner!*\nOnly owner can use `.public` command.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
      }

      // 🔓 Set selfmode to false (public mode)
      data.enabled = false;
      fs.writeFileSync(configPath, JSON.stringify(data, null, 2));
      return reply("🔓 *Public mode activated!*\nEveryone can use the bot now.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");

    } catch (err) {
      console.error("❌ Error in .public:", err.message);
      return reply("❌ *Error while activating public mode.*\nCheck logs for details.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
    }
  }
};