module.exports = async function ({ conn, m, isGroup, reply }) {
  if (!isGroup) return reply("❌ This command only works in groups.");

  async function safeGroupMetadata(conn, chatId, timeout = 5000) {
    return Promise.race([
      conn.groupMetadata(chatId),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), timeout)
      )
    ]);
  }

  try {
    const metadata = await safeGroupMetadata(conn, m.chat);
    const groupName = metadata.subject || "N/A";
    const groupId = metadata.id || m.chat;
    const owner = metadata.owner ? `@${metadata.owner.split("@")[0]}` : "Not found";
    const members = metadata.participants.length;
    const description = metadata.desc || "No description available.";

    reply(
`👥 *Group Information:*

🏷️ *Name:* ${groupName}
🆔 *ID:* ${groupId}
👑 *Owner:* ${owner}
👤 *Total Members:* ${members}
📃 *Description:* ${description}

────────────────────────
🔔 *Official Channel:* https://www.youtube.com/@demoneye_official
> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓`
    );
  } catch (err) {
    console.error("❌ .groupinfo error:", err);
    reply("❌ Failed to fetch group info. I might not be in the group, or your WhatsApp is slow.\nTry again after 1-2 seconds.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
  }
};