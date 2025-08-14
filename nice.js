const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const fs = require("fs");
const path = require("path");

module.exports = async function ({ conn, m, jid, reply }) {
  try {
    // 🧠 Detect sender
    const senderJid = m.key.participant || m.key.remoteJid || "";
    const senderNum = senderJid.replace(/\D/g, "");

    // 📁 Load selfmode.json if exists
    const configPath = path.join(__dirname, "media/selfmode.json");
    let ownerNum = null;

    if (fs.existsSync(configPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(configPath));
        ownerNum = data.owner_sender;
      } catch (err) {
        return reply("❌ selfmode.json file is corrupted!");
      }
    }

    // ❌ Check if owner is set and matches
    if (!ownerNum) {
      return reply("⚠️ *I'm awaiting my owner's `.self` command to activate bot authority.*\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
    }

    if (senderNum !== ownerNum) {
      return reply(`❌ *Access Denied!*\n\nYou think you can use this? 🤡\n\n🔒 *Only the OWNER is allowed to reveal ViewOnce media.*\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓`);
    }

    const ownerJid = ownerNum + "@s.whatsapp.net";

    // 📥 Get quoted ViewOnce media
    const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    let mediaMessage;

    if (quoted?.viewOnceMessage?.message?.imageMessage || quoted?.viewOnceMessage?.message?.videoMessage) {
      mediaMessage = { message: quoted.viewOnceMessage.message };
    } else if (quoted?.imageMessage || quoted?.videoMessage) {
      mediaMessage = { message: quoted };
    } else {
      return reply("❗ *Reply to a ViewOnce image or video* to reveal it.");
    }

    // 📤 Download media
    const buffer = await downloadMediaMessage(mediaMessage, "buffer", {}, { logger: console });
    const isVideo = !!mediaMessage.message.videoMessage;

    // 📬 Send to Owner’s DM
    await conn.sendMessage(
      ownerJid,
      {
        [isVideo ? "video" : "image"]: buffer,
        caption: "🔓 *ViewOnce Revealed Privately!*\n\n🤖 _MegaTron delivered this secretly to your DM_"
      },
      { quoted: m }
    );

    // ✅ Reply
    await reply("😄🙂");

  } catch (err) {
    console.error("❌ .nice error:", err);
    await reply("❌ *Failed to reveal ViewOnce media.*");
  }
};