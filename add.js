const fs = require("fs");
const path = require("path");

// 🔢 Clean number from JID
function getCleanNumber(jid) {
  return jid ? jid.replace(/\D/g, "") : null;
}

// 🔍 Identify sender
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
    const senderNum = resolveSenderNumber(m, conn);
    if (!senderNum) return reply("❌ Unable to detect the sender.");

    // 🔐 Owner check via selfmode.json
    const configPath = path.join(__dirname, "media/selfmode.json");

    if (!fs.existsSync(configPath)) {
      return reply("⚠️ Bot is in inactive mode. Ask the owner to activate it using `.self`.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
    }

    let jsonData;
    try {
      jsonData = JSON.parse(fs.readFileSync(configPath));
    } catch {
      return reply("❌ `selfmode.json` is corrupted or invalid.");
    }

    const realOwner = jsonData.owner_sender;
    if (senderNum !== realOwner) {
      return reply("🚫 *Access Denied!*\n\nOnly the *bot owner* is allowed to run `.add`.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
    }

    // ✅ Group check
    if (!jid.endsWith("@g.us")) {
      return reply("❌ Group-only command.\nYou can only use `.add` inside a group.");
    }

    // 🎯 Target number check
    if (!args[0]) {
      return reply("❌ Please provide a number to add.\nExample: `.add 923xxxxxxxxx`");
    }

    const number = args[0].replace(/\D/g, "") + "@s.whatsapp.net";

    // 🚀 Attempt to add member
    const response = await conn.groupParticipantsUpdate(jid, [number], "add");

    if (response?.[0]?.status === 200 || response?.[0]?.code === 200) {
      return reply(`✅ Successfully added: ${args[0]}\n\n> 𝗧𝗔𝗬𝗬𝗔𝗕 ❦ ✓`);
    } else {
      return reply(`❌ Failed to add: ${args[0]}\nReason: ${response?.[0]?.status || "Unknown"}\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓`);
    }

  } catch (err) {
    console.error("❌ Error in .add:", err);
    return reply("❌ Something went wrong while adding the user.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
  }
};