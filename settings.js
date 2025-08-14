// ✅ MegaTron Bot Stylish Configuration – by 𝗧𝗔𝗬𝗬𝗔𝗕 ❦ ✓

// 🔗 Import owner number from ./Owner/owner.js
const ownerNumber = require('./Owner/owner'); // 💡 owner.js should export array of numbers like ['923123456789']

const config = {
  ownerNumber, // 👑 Owner Number(s)
  botName: '🤖 𝗠𝗘𝗚𝗔𝐓𝐑𝐎𝐍 𝑩𝑶𝑻 ⚡',       // 💥 Stylish Bot Name
  ownerName: '𓆩 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦︎𓆪',             // 👑 Stylish Owner Name
  youtube: 'https://www.youtube.com/@TayyabExploitZ', // 🔗 YouTube Channel
  signature: '> 𝗧𝗔𝗬𝗬𝗔𝗕 ❦ ✓',              // 🖋️ Footer Signature

  autoTyping: false,     // ⌨️ Fake Typing Feature
  autoReact: false,      // 💖 Auto Emoji Reaction
  autoStatusView: false, // 👁️ Auto Status Seen
  public: true,          // 🌍 Public or Private Mode
  antiLink: false,       // 🚫 Anti-Link Protection
  antiBug: false,        // 🛡️ Anti Crash/Bug Guard
  greetings: true,       // 🙋 Auto Greeting
  readmore: false        // 📜 Enable Readmore Effect
};

// ✅ Register owner number globally in full WhatsApp JID format
global.owner = (
  Array.isArray(ownerNumber) ? ownerNumber : [ownerNumber]
).map(num => num.replace(/\D/g, '') + '@s.whatsapp.net');

// ⚙️ Export settings loader
function loadSettings() {
  return config;
}

module.exports = { loadSettings };