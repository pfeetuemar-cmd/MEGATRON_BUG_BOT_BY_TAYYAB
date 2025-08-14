module.exports = async function ({ conn, m, isGroup, isBotAdmin, participants, reply }) {
  if (!isGroup) return reply("❌ This command only works in groups.");

  if (!participants || !Array.isArray(participants)) {
    return reply("❌ Failed to fetch group participants. Try again later.");
  }

  const sender = m.sender;
  const isAdmin = participants.some(p => p.id === sender && p.admin);
  const botNumber = conn.user?.id?.split(":")[0];
  const isOwner = global.owner.includes(sender.replace(/\D/g, ""));
  const isBotOwner = sender.includes(botNumber);

  if (!isAdmin && !isOwner && !isBotOwner) {
    return reply("❌ Only group admin or bot owner can use this command.");
  }

  if (!isBotAdmin) {
    return reply("❌ I need admin rights to revoke the group invite link.");
  }

  try {
    const newInviteCode = await conn.groupRevokeInvite(m.chat);
    return reply(
      `✅ *Group invite link has been revoked successfully!*\n\n` +
      `🔗 *New Invite Link:* https://chat.whatsapp.com/${newInviteCode}\n\n` +
      `📺 Subscribe my YouTube: https://www.youtube.com/@demoneye_official\n\n` +
      `> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓`
    );
  } catch (e) {
    console.error("❌ Error in .revoke:", e);
    return reply("❌ Failed to revoke invite link. Maybe I'm not admin?");
  }
};