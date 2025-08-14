module.exports = async function ({ conn, m, participants, isGroup, reply }) {
  if (!isGroup) return reply("❌ This command only works in groups.");

  // ✅ Check if sender is owner
  const senderJid = m.key?.participant || m.key?.remoteJid || m.sender;
  const senderNum = senderJid.replace(/\D/g, "");
  const ownerList = Array.isArray(global.owner) ? global.owner : [global.owner];
  const isOwner = ownerList.map(o => o.toString().replace(/\D/g, "")).includes(senderNum);

  if (!isOwner) return reply("❌ Only bot owner can use this command.");

  // 👥 Get mentioned users
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

  if (mentioned.length === 0) {
    return reply("❌ Please tag a user to demote.\n\n_Example: .demote @user_");
  }

  for (let jid of mentioned) {
    await conn.groupParticipantsUpdate(m.chat, [jid], "demote")
      .then(() => reply(`✅ *Demoted:* @${jid.split("@")[0]}`), { mentions: [jid] })
      .catch(() => reply("❌ Failed to demote. Make sure the bot is an admin."));
  }
};