module.exports = async function ({ conn, m, reply }) {
  try {
    let targetJid;

    if (m.quoted) {
      targetJid = m.quoted.sender;
    } else if (m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]) {
      targetJid = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else {
      targetJid = m.sender;
    }

    reply(
      `🧾 *WhatsApp ID:*\n\`\`\`${targetJid}\`\`\`\n\n📺 *YouTube Channel:*\nhttps://www.youtube.com/@demoneye_official\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓`
    );
  } catch (err) {
    console.error("❌ .id command error:", err);
    reply("❌ Failed to get ID.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
  }
};