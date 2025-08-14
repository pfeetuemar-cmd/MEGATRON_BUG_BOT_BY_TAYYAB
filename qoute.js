module.exports = async function ({ reply }) {
  try {
    const quotes = [
      "💻 Hack the planet, but patch your own system first.",
      "🔥 Great power comes with great responsibility.",
      "👨‍💻 Every byte counts when you're breaching the system.",
      "🔐 Security isn't a product, it's a process.",
      "⚡ Technology is best when it brings people together.",
      "🧠 Stay hungry, stay foolish. — Steve Jobs",
      "🎯 Focus on code, not chaos.",
      "🚀 Don’t fear failure — learn from it and relaunch!",
      "😈 Every click is a footprint. Think like a hacker.",
      "👁‍🗨 Privacy is not a privilege, it's a right.",
      "📟 In a world full of firewalls, be a Trojan horse."
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    reply(`${randomQuote}\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓\n📺 https://www.youtube.com/@demoneye_official`);
  } catch (err) {
    console.error("❌ .quote command error:", err);
    reply("❌ Couldn't fetch a quote right now. Try again later.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
  }
};