module.exports = async function ({ conn, m, args, reply }) {
  try {
    // 🧠 Identify sender
    const senderJid = m.key.participant || m.key.remoteJid || "";
    const senderNum = senderJid.replace(/\D/g, "");

    // 📁 Check selfmode.json for real owner
    const fs = require("fs");
    const path = require("path");
    const configPath = path.join(__dirname, "media/selfmode.json");

    let ownerNum = null;
    if (fs.existsSync(configPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(configPath));
        ownerNum = data.owner_sender;
      } catch (err) {
        return reply("❌ selfmode.json file is corrupted!");
      }
    }

    if (!ownerNum) {
      return reply("⚠️ *I'm awaiting my owner's `.self` command to activate bot authority.*\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
    }

    if (senderNum !== ownerNum) {
      return reply(`🚫 *Who the hell are you?*\n\nOnly the OWNER can set bio, not you 🤡\n\n🔒 Access Denied!\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓`);
    }

    // ✅ Set Bio
    const text = args.join(" ");
    if (!text) return reply("❌ Bio text likho!\n\nUsage: `.setbio I am TayyaB Bot`");

    await conn.updateProfileStatus(text);
    return reply(`✅ Bio successfully updated:\n*${text}*\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓`);
    
  } catch (err) {
    console.error("[ERROR] .setbio:", err);
    return reply("❌ Bio set karne mein error aaya.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
  }
};