module.exports = async function ({ conn, m, reply, jid }) {
  try {
    // ✅ Extract sender number (works for both DM and Group)
    const senderJid =
      m.key.participant || // group
      m.key.remoteJid || ""; // dm
    const senderNum = senderJid.replace(/\D/g, "");

    // ✅ Clean global.owner → only numbers
    const cleanOwners = Array.isArray(global.owner)
      ? global.owner.map(n => n.replace(/\D/g, ""))
      : [global.owner.toString().replace(/\D/g, "")];

    // ✅ Owner check
    const isOwner = cleanOwners.includes(senderNum);
    if (!isOwner)
      return await conn.sendMessage(jid, {
        text: "🔒 *Only Bot Owner can use .clearall*\n\n> 𝗧𝗔𝗬𝗬𝗔𝗕 ❦ ✓"
      }, { quoted: m });

    // ✅ Clear chat using chatModify (works only in DMs mostly)
    await conn.chatModify(
      { clear: { messages: [{ id: m.key.id, fromMe: false }] } },
      jid
    );

    return await conn.sendMessage(jid, {
      text: `🧹 *Chat cleared successfully in this thread!*\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓`
    }, { quoted: m });

  } catch (e) {
    console.error("[ERROR] .clearall:", e);
    return await conn.sendMessage(jid, {
      text: "❌ Chat clear nahi ho saka. Terminal log check karo.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓"
    }, { quoted: m });
  }
};