module.exports = async function ({ conn, m, args, reply }) {
  try {
    const emoji = args[0];
    if (!emoji) return reply("❌ Please provide an emoji to react with.\n\n_Example: .react 😈_");

    // ✅ Check if it's a reply
    if (!m.message?.extendedTextMessage?.contextInfo?.stanzaId) {
      return reply("❌ Please *reply to a message* to react.");
    }

    const reaction = {
      react: {
        text: emoji,
        key: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.message.extendedTextMessage.contextInfo.stanzaId,
          participant: m.message.extendedTextMessage.contextInfo.participant || m.chat
        }
      }
    };

    await conn.sendMessage(m.chat, reaction);
    return reply(`✅ Reacted with: ${emoji}\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓`);

  } catch (err) {
    console.error("❌ .react error:", err);
    return reply("❌ Failed to react to message.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
  }
};