module.exports = async function ({ conn, m, reply, isGroup, jid }) {
  if (!isGroup) return reply("❌ Group only command.");

  // 🔍 Clean number from JID
  const getCleanNumber = (jid) => (jid ? jid.replace(/\D/g, "") : null);

  // 🔍 Resolve real sender number
  const resolveSenderNumber = (m, conn) => {
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
  };

  // 📲 Identify who sent the command
  const senderNum = resolveSenderNumber(m, conn);
  if (!senderNum) return reply("❌ Sender not detected.");

  // 🧠 Prepare clean global owner list
  const rawOwners = global.owner || [];
  const ownerList = Array.isArray(rawOwners) ? rawOwners : [rawOwners];
  const cleanOwners = ownerList.map(num => num.toString().replace(/\D/g, ""));

  // ➕ Add bot number (so bot doesn't block itself)
  const botNum = getCleanNumber(conn?.user?.id);
  if (botNum && !cleanOwners.includes(botNum)) cleanOwners.push(botNum);

  // ✅ Final owner check
  const isOwner = cleanOwners.includes(senderNum);
  if (!isOwner)
    return reply("🔒 Only Bot Owner can delete messages.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");

  // 🔍 Extract message ID and participant to delete
  const msgId = m.message?.extendedTextMessage?.contextInfo?.stanzaId;
  const participant = m.message?.extendedTextMessage?.contextInfo?.participant;

  if (!msgId || !participant)
    return reply("❌ No message found to delete.");

  // 🗑️ Delete message
  await conn.sendMessage(jid, {
    delete: {
      remoteJid: jid,
      fromMe: false,
      id: msgId,
      participant: participant,
    },
  });

  return reply("🗑️ Message deleted successfully.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
};