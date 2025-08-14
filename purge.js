function getCleanNumber(jid) {
  return jid ? jid.replace(/\D/g, "") : null;
}

function resolveSenderNumber(m, conn) {
  let senderJid =
    m.sender ||
    m.key?.participant ||
    m.participant ||
    (m.key?.fromMe && conn?.user?.id) ||
    m.key?.remoteJid ||
    m.message?.extendedTextMessage?.contextInfo?.participant;

  if (!senderJid && conn?.decodeJid) {
    try {
      senderJid = conn.decodeJid(m?.key?.remoteJid);
    } catch {
      senderJid = null;
    }
  }

  return getCleanNumber(senderJid);
}

module.exports = async function ({ conn, m, isGroup, reply, participants }) {
  try {
    if (!isGroup) return reply("❌ This command only works in groups.");
    if (!participants || !Array.isArray(participants)) {
      return reply("❌ Unable to fetch participants.");
    }

    const senderNum = resolveSenderNumber(m, conn);
    if (!senderNum) return reply("❌ Unable to detect sender.");

    // ✅ Owner check
    const rawOwners = global.owner || [];
    const ownerList = Array.isArray(rawOwners) ? rawOwners : [rawOwners];
    const cleanOwners = ownerList.map(num => num.toString().replace(/\D/g, ""));
    const isOwner = cleanOwners.includes(senderNum);

    // ✅ Admin check
    const senderJid = m.sender || "";
    const isAdmin = participants.some(p => p.id === senderJid && p.admin);

    if (!isAdmin && !isOwner) return reply("❌ Only group admins or bot owner can use this.");

    const chat = await conn.loadMessages(m.chat, 100);
    let deleted = 0;

    for (let msg of chat) {
      const fromBot = msg.key?.fromMe;
      const msgId = msg.key?.id;
      const remoteJid = msg.key?.remoteJid;

      if (fromBot && msgId && remoteJid) {
        try {
          await conn.sendMessage(m.chat, {
            delete: { remoteJid, fromMe: true, id: msgId }
          });
          deleted++;
        } catch (e) {}
      }
    }

    return reply(
      `✅ *Purge complete.*\nDeleted ${deleted} messages.\n\n📎 YouTube: https://www.youtube.com/@demoneye_official\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓`
    );
  } catch (err) {
    console.error("❌ Error in .purge command:", err.message);
    return reply("❌ Something went wrong while purging messages.");
  }
};