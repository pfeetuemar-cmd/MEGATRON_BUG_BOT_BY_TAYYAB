const fs = require("fs");
const path = require("path");

module.exports = async function ({ conn, m, isGroup, participants, reply }) {
  try {
    // ❌ Group-only check
    if (!isGroup) return reply("❌ *This command only works in groups.*\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");

    // 📁 Load selfmode.json
    const selfPath = path.join(__dirname, "../media/selfmode.json");
    if (!fs.existsSync(selfPath)) {
      return reply("⚠️ *I'm awaiting my owner's `.self` command to activate authority.*\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
    }

    const data = JSON.parse(fs.readFileSync(selfPath));
    const savedOwner = data.owner_sender;

    // 🧼 Clean sender number
    const senderJid = m.key?.participant || m.key?.remoteJid || "";
    const senderNum = senderJid.replace(/\D/g, "");

    // 🔐 Only real saved owner can use this command
    if (senderNum !== savedOwner) {
      return reply(`*Oye Bandaqchor!*\n\n🔐 Only the *REAL OWNER* can use .hidetag\n\nStop acting smart, go code your own bot 😎`);
    }

    // ✅ Safe participant check
    if (!participants || !Array.isArray(participants)) {
      return reply("❌ Unable to fetch group participants. Try again.");
    }

    // ✅ Get the full command message
    const body = m.message?.conversation || m.message?.extendedTextMessage?.text || "";
    const args = body.trim().split(/\s+/).slice(1); // remove '.hidetag'
    const text = args.join(" ");

    if (!text || text.trim() === "") {
      return reply("❌ *Write Text what you want to send.*\n\n_Example: .hidetag Hello sabko!_");
    }

    // ✅ Prepare everyone to mention
    const tagList = participants.map(p => p.id);

    // ✅ Send message with hidden tag
    await conn.sendMessage(m.chat, {
      text,
      mentions: tagList
    }, { quoted: m });

    return reply("✅ *Message sent using hidden tag.*\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");

  } catch (err) {
    console.error("❌ Hidetag Error:", err.message);
    return reply("❌ Something went wrong while using hidetag.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
  }
};