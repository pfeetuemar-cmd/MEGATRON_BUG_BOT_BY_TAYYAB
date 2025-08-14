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

module.exports = async function ({ conn, m, reply, isGroup, jid }) {
  if (!isGroup) return reply("❌ *Group only command.*");

  const senderNum = resolveSenderNumber(m, conn);
  if (!senderNum) return reply("❌ *Unable to detect sender.*");

  // ✅ Owner check
  const rawOwners = Array.isArray(global.owner) ? global.owner : [global.owner];
  const cleanOwners = rawOwners.map(o => o.toString().replace(/\D/g, ""));
  const botNum = getCleanNumber(conn?.user?.id);
  if (botNum && !cleanOwners.includes(botNum)) cleanOwners.push(botNum);

  if (!cleanOwners.includes(senderNum)) {
    return reply("🔒 *Only the bot owner can use this command.*\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
  }

  // 🎯 Target resolution
  const context = m.message?.extendedTextMessage?.contextInfo || {};
  const mentioned = context.mentionedJid?.[0];
  const repliedTo = context.participant;

  const target = mentioned || repliedTo;

  if (!target) {
    return reply("❌ *Please mention a user or reply to someone to kick.*\n\nExample: `.kick @user` or reply to message");
  }

  try {
    await conn.groupParticipantsUpdate(jid, [target], "remove");
    return reply("✅ *Member removed successfully.*\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
  } catch (err) {
    console.error("❌ Kick Error:", err);
    return reply("❌ *Failed to kick the member.*\nMaybe the bot isn't an admin.");
  }
};