const fs = require("fs");
const path = require("path");
const { generateWAMessageFromContent } = require("@whiskeysockets/baileys");
const prefix = ".";

async function handleCommand(conn, m) {
const message =
m.message?.conversation ||
m.message?.extendedTextMessage?.text ||
m.message?.imageMessage?.caption ||
m.message?.videoMessage?.caption ||
"";

if (!message.startsWith(prefix)) return;

const parts = message.trim().split(/ +/);
const command = parts[0].slice(1).toLowerCase();
const args = parts.slice(1);
const jid = m.key.remoteJid;
const isGroup = jid.endsWith("@g.us");
const senderJid = m.key.participant || m.key.remoteJid || "";
const senderNum = senderJid.replace(/\D/g, "");
const cleanOwners = Array.isArray(global.owner) ? global.owner.map(n => n.replace(/\D/g, "")) : [global.owner.toString().replace(/\D/g, "")];
const isOwner = cleanOwners.includes(senderNum);

const reply = (text) =>
conn.sendMessage(jid, { text: text + "\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓" }, { quoted: m });


if (command === "idcheck") {
  const senderJid = m.key?.participant || m.key?.remoteJid || '';
  const senderNum = senderJid.replace(/\D/g, '');
  return reply(`🤖 *Bot ID:* ${conn.user.id}
📤 *Sender JID:* ${senderJid}
🔢 *Sender Clean:* ${senderNum}`);
}





if (command === "menu") {
const menuPath = path.join(__dirname, "..", "media", "ping.json");
if (!fs.existsSync(menuPath)) {
return reply("no captured menu");
}

const raw = fs.readFileSync(menuPath, "utf-8");  
const captured = JSON.parse(raw);  

const forward = generateWAMessageFromContent(jid, captured.message, { userJid: jid });  
return await conn.relayMessage(jid, forward.message, { messageId: forward.key.id });

}

if (command === "capturethismenubytayyab") {
const savePath = path.join(__dirname, "..", "media", "ping.json");
if (fs.existsSync(savePath)) return reply("chal nikal bsdk");

if (!m.message?.extendedTextMessage?.contextInfo?.quotedMessage) {  
  return reply("❌ Reply a forwarded menu message to capture.");  
}  

const quoted = m.message.extendedTextMessage.contextInfo.quotedMessage;  
const wrapped = {  
  message: quoted  
};  

fs.writeFileSync(savePath, JSON.stringify(wrapped, null, 2));  
return reply("✅ Menu captured successfully.");

}

// ❌ Original hardcoded scary menu DISABLED but kept for reference:
/*
if (command === "menu") {
const sendMenu = async () => {
const menuText =    ╭⸸⸸⸸⸸⸸〔 ⚠ 𝙈𝙀𝙂𝘼𝙏𝙍𝙊𝙉 ⚠ 𓆩 𝐁𝐎𝐓 𝐌𝐄𝐍𝐔 𓆪 〕⸸⸸⸸⸸⸸╮   ┃ 🩸 𓆩 【☠︎𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑☠︎ 𓆪   ┃ 🧬 STATUS: 𖤐 CODE_LOCKED()   ┃ 🔥 LEVEL: ✴ MAXIMUM INFERNO   ┃   ┣⛧『 👑 OWNER MENU 』⛧   ┃ ☠ .nice   ┃ ☠ .block   ┃ ☠ .unblock   ┃ ☠ .self   ┃ ☠ .public   ┃ ☠ .restart   ┃ ☠ .clearall   ┃ ☠ .setbio   ┃ ☠ .setname   ┃ ☠ .banlist   ┃ ☠ .unban   ┃ ☠ .systemkill   ┃ ☠ .dbcheck   ┃ ☠ .limitreset   ┃   ┣⛧『 👥 GROUP MENU 』⛧   ┃ ⚔ .add   ┃ ⚔ .kick   ┃ ⚔ .del   ┃ ⚔ .tagall   ┃ ⚔ .open   ┃ ⚔ .close   ┃ ⚔ .hidetag   ┃ ⚔ .promote   ┃ ⚔ .demote   ┃ ⚔ .groupsettings   ┃ ⚔ .revoke   ┃ ⚔ .purge   ┃   ┣⛧『 🔁 AUTO SYSTEMS 』⛧   ┃ 🧿 .antilink on   ┃ 🧿 .antibug on   ┃ 🧿 .autotyping on   ┃ 🧿 .autoreact on   ┃ 🧿 .autostatus on   ┃ 🧿 .autogreet on   ┃ 🧿 .readmore   ┃   ┣⛧『 ⚙ UTILITY 』⛧   ┃ 🜲 .menu   ┃ 🜲 .ping   ┃ 🜲 .alive   ┃ 🜲 .owner   ┃ 🜲 .rules   ┃ 🜲 .donate   ┃ 🜲 .channel   ┃ 🜲 .capturethismenubytayyab   ┃ 🜲 .runtime   ┃ 🜲 .botname   ┃ 🜲 .ownername   ┃ 🜲 .groupinfo   ┃ 🜲 .infobot   ┃ 🜲 .react   ┃ 🜲 .id   ┃ 🜲 .delete   ┃ 🜲 .emoji   ┃ 🜲 .quote   ┃   ┣⛧『 💣 BUGS MENU 』⛧   ┃ ☣ .xvoids   ┃ ☣ .uicrash   ┃ ☣ .xfreeze   ┃ ☣ .bugmode   ┃ ☣ .fuckvictim   ┃ ☣ .darktron   ┃ ☣ .blankui   ╰━━━〔 【☠︎TAYYAB☠︎】 CREATOR OF WHATSAPP DEATH 〕━━━╯;

const menuForward = generateWAMessageFromContent(jid, {  
    extendedTextMessage: {  
      text: menuText,  
      contextInfo: {  
        forwardingScore: 999,  
        isForwarded: true,  
        externalAdReply: {  
          title: "Tayyab Exploits",  
          body: "Official WhatsApp Bot Menu",  
          previewType: "PHOTO",  
          thumbnail: fs.readFileSync("./media/menu.jpg"),  
          mediaType: 1,  
          renderLargerThumbnail: true,  
          sourceUrl: "https://whatsapp.com/channel/0029Vb5thaL6hENyUTXgcz3n"  
        }  
      }  
    }  
  }, { userJid: jid });  

  await conn.relayMessage(jid, menuForward.message, {  
    messageId: menuForward.key.id,  
  });  
};  

return sendMenu();

}
*/

if (command === "hidetag") {
  if (!isGroup) return reply("❌ Group only command.");
  try {
    const groupMeta = await conn.groupMetadata(jid);
    const participants = groupMeta.participants || [];
    const tagList = participants.map(p => p.id);
    const fullMsg = m.message?.conversation || m.message?.extendedTextMessage?.text || "";
    const text = fullMsg.split(" ").slice(1).join(" ");
    if (!text) return reply("❌ *Text likho jo bhejna hai.*\n\n_Example: .hidetag Hello sabko!_");

    await conn.sendMessage(jid, { text, mentions: tagList }, { quoted: m });
    return reply("✅ *Message sent using hidden tag.*\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
  } catch (err) {
    console.error("❌ Hidetag Error:", err);
    return reply("❌ Something went wrong while using hidetag.");
  }
}

try {
const filePath = path.join(__dirname, "..", `${command}.js`);
if (fs.existsSync(filePath)) {
const cmdFile = require(filePath);
if (typeof cmdFile === "function") {
return await cmdFile({ conn, m, message, args, command, jid, isGroup, sender: senderNum, isOwner, reply });
}
if (typeof cmdFile.run === "function") {
return await cmdFile.run({ conn, m, message, args, command, jid, isGroup, sender: senderNum, isOwner, reply });
}
}
} catch (err) {
console.error("❌ Error in command:", command, err);
return reply("❌ Command Error Occurred.");
}

return reply("❌ Unknown command. Try .menu");
}

module.exports = { handleCommand };
