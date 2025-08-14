const fs = require("fs");
const readline = require("readline");
const P = require("pino");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} = require("@whiskeysockets/baileys");

const { handleCommand } = require("./menu/case");
const { loadSettings } = require("./settings");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger: P({ level: "fatal" })
  });

  // ✅ Load Settings
  const settings = typeof loadSettings === 'function' ? loadSettings() : {};
  let ownerRaw = settings.ownerNumber?.[0] || "92300xxxxxxx";
  const ownerJid = ownerRaw.includes("@s.whatsapp.net") ? ownerRaw : ownerRaw + "@s.whatsapp.net";

  // 🌐 Global Variables
  global.sock = sock;
  global.settings = settings;
  global.signature = settings.signature || "> 𝗧𝗔𝗬𝗬𝗔𝗕 ❦ ✓";
  global.owner = ownerJid;
  global.ownerNumber = ownerRaw;
  global.antilink = {};
  global.autogreet = {};
  global.autotyping = false;
  global.autoreact = false;
  global.autostatus = false;

  console.log("✅ BOT OWNER:", global.owner);

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "open") {
      console.log("✅ [BOT ONLINE] Connected to WhatsApp!");
      rl.close();

      // 🔁 [NEW LOGIC] Auto-reset selfmode & owner if number changed
      try {
        const selfPath = require("path").join(__dirname, "media", "selfmode.json");
        const ownerPath = require("path").join(__dirname, "Owner", "owner.js");
        const botJid = sock.user.id;
        const cleanBotNum = botJid.split(":")[0].replace(/\D/g, "");

        let reset = false;

        if (fs.existsSync(selfPath)) {
          const selfData = JSON.parse(fs.readFileSync(selfPath));
          if (selfData.owner_sender && selfData.owner_sender !== cleanBotNum) {
            console.log("⚠️ [SELF MODE] Owner mismatch detected. Deleting old selfmode.json");
            fs.unlinkSync(selfPath);
            reset = true;
          }
        }

        if (fs.existsSync(ownerPath)) {
          const ownerContent = fs.readFileSync(ownerPath, "utf-8");
          if (!ownerContent.includes(cleanBotNum)) {
            console.log("⚠️ [OWNER FILE] Mismatch detected. Deleting owner.js");
            fs.unlinkSync(ownerPath);
            reset = true;
          }
        }

        if (!reset) {
          console.log("✅ [OWNER CHECK] Owner matches. No reset needed.");
        }
      } catch (err) {
        console.error("❌ [OWNER CHECK ERROR]:", err.message);
      }
    }

    if (connection === "close") {
      const shouldReconnect = (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut);
      console.log("❌ Disconnected. Reconnecting:", shouldReconnect);
      if (shouldReconnect) startBot();
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    const jid = msg.key.remoteJid;
    const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";

    if (global.autotyping && jid !== "status@broadcast") {
      try {
        await sock.sendPresenceUpdate('composing', jid);
        await new Promise(res => setTimeout(res, 2000));
      } catch (err) {
        console.error("❌ AutoTyping Error:", err.message);
      }
    }

    if (global.autoreact && jid !== "status@broadcast") {
      try {
        await sock.sendMessage(jid, {
          react: { text: "❤️", key: msg.key }
        });
      } catch (err) {
        console.error("❌ AutoReact Error:", err.message);
      }
    }

    if (global.autostatus && jid === "status@broadcast") {
      try {
        await sock.readMessages([
          {
            remoteJid: jid,
            id: msg.key.id,
            participant: msg.key.participant || msg.participant
          }
        ]);
        console.log(`👁️ Status Seen: ${msg.key.participant || "Unknown"}`);
      } catch (err) {
        console.error("❌ AutoStatus View Error:", err.message);
      }
      return;
    }

    if (
      jid.endsWith("@g.us") &&
      global.antilink[jid] === true &&
      /(chat\.whatsapp\.com|t\.me|discord\.gg|wa\.me|bit\.ly|youtu\.be|https?:\/\/)/i.test(text) &&
      !msg.key.fromMe
    ) {
      try {
        await sock.sendMessage(jid, {
          delete: {
            remoteJid: jid,
            fromMe: false,
            id: msg.key.id,
            participant: msg.key.participant || msg.participant
          }
        });
        console.log(`🔗 Link deleted in group: ${jid}`);
      } catch (err) {
        console.error("❌ Antilink Delete Error:", err.message);
      }
    }

    if (
      jid.endsWith("@g.us") &&
      global.autogreet[jid] === true &&
      !msg.key.fromMe &&
      msg.message?.protocolMessage?.type !== 0
    ) {
      try {
        const userName = msg.pushName || "User";
        const greetText = `👋 Assalamualaikum ${userName}!\n\nWelcome to the group. Enjoy your stay!\n\n> 𝗧𝗔𝗬𝗬𝗔𝗕 ❦ ✓\n📺 https://www.youtube.com/@TayyabExploitZ`;

        await sock.sendMessage(jid, {
          text: greetText,
          mentions: [msg.key.participant || msg.participant],
        });

        console.log("✅ AutoGreet sent.");
      } catch (err) {
        console.error("❌ AutoGreet Error:", err.message);
      }
    }

    try {
      await handleCommand(sock, msg, {});
    } catch (err) {
      console.error("❌ Command error:", err.message || err);
    }
  });

  sock.ev.on("group-participants.update", async (update) => {
    const { id, participants, action } = update;

    if (!global.autogreet?.[id]) return;

    for (const user of participants) {
      const userName = user.split("@")[0];
      let message = "";

      if (action === "add") {
        message = `🌟 *Welcome to the Group!* 🌟\n👤 *@${userName}*\n🧠 *AutoGreet by MegaTron*\n📺 youtube.com/@TayyabExploitZ\n> 𝗧𝗔𝗬𝗬𝗔𝗕 ❦️ ✓`;
      } else if (action === "remove") {
        message = `👋 *Goodbye @${userName}*\n\n🧠 *AutoFarewell by MegaTron*\n📺 youtube.com/@TayyabExploitZ\n> 𝗧𝗔𝗬𝗬𝗔𝗕 ❦️ ✓`;
      }

      if (message) {
        await sock.sendMessage(id, {
          text: message,
          mentions: [user],
        });
      }
    }
  });

  if (!state.creds?.registered) {
    const phoneNumber = await question("📱 Enter your WhatsApp number (with country code): ");
    await sock.requestPairingCode(phoneNumber.trim());

    setTimeout(() => {
      const code = sock.authState.creds?.pairingCode;
      if (code) {
        console.log("\n🔗 Pair this device using this code in WhatsApp:\n");
        console.log("   " + code + "\n");
        console.log("Go to WhatsApp → Linked Devices → Link with code.");
      } else {
        console.log("❌ Pairing code not found.");
      }
    }, 1000);
  }
}

startBot();