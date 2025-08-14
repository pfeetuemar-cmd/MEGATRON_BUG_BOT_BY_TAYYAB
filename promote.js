module.exports = async function ({ conn, m, participants, isGroup, reply }) {
  if (!isGroup) return reply("❌ *Sirf group mein hi chalay ga.*");

  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

  if (mentioned.length === 0) {
    return reply("❌ *Kise promote karna hai?* Tag user.\n\n_Example: .promote @user_");
  }

  try {
    for (let jid of mentioned) {
      const userInGroup = participants.find(p => p.id === jid);

      // ❗ Check if already admin
      if (userInGroup?.admin === "admin" || userInGroup?.admin === "superadmin") {
        await conn.sendMessage(m.chat, {
          text: `ℹ️ @${jid.split("@")[0]} is already an admin.`,
          mentions: [jid]
        }, { quoted: m });
        continue;
      }

      // ⏳ Timeout-protected promote
      const promoteWithTimeout = Promise.race([
        conn.groupParticipantsUpdate(m.chat, [jid], "promote"),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 7000))
      ]);

      await promoteWithTimeout;

      await conn.sendMessage(m.chat, {
        text: `✅ *Promoted:* @${jid.split("@")[0]}`,
        mentions: [jid]
      }, { quoted: m });
    }
  } catch (e) {
    console.error("❌ Promote error:", e);
    return reply("❌ *Promote failed.* Shayad main admin nahi hoon ya WhatsApp ne time out kar diya.");
  }
};