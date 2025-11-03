# ✨ TextIt - Universal Text Format Converter

<div align="center">

![TextIt Banner](https://img.shields.io/badge/TextIt-Format%20Converter-purple?style=for-the-badge&logo=files&logoColor=white)

**🚀 Convert text to 8+ formats instantly • Privacy-first • Zero server uploads**

[**Live Demo →**](https://textit.saurabpoudel.com.np)

[![Svelte 5](https://img.shields.io/badge/Svelte-5-FF3E00?style=flat&logo=svelte&logoColor=white)](https://svelte.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

</div>

---

## 🎯 What is TextIt?

TextIt is a blazing-fast, client-side text format converter that transforms your content into multiple formats instantly. Perfect for developers, writers, researchers, and anyone working with AI models!

### ✨ Key Features

- 🤖 **AI-Ready** - Format text for feeding context to LLMs
- 🔒 **100% Privacy** - All processing happens in your browser
- ⚡ **8+ Formats** - TXT, Markdown, HTML, JSON, CSV, XML, RTF, LaTeX
- 🎨 **Modern UI** - Glassmorphic design with smooth animations
- 📂 **Drag & Drop** - Just drop your text files
- ⌨️ **Keyboard Shortcuts** - Power user friendly
- 📊 **Live Stats** - Character, word, line count & reading time
- 👁️ **Format Preview** - See before you download
- 🌐 **Zero Installation** - Works everywhere, instantly

---

## 🚀 Quick Start

### Try it Now
Visit **[textit.saurabpoudel.com.np](https://textit.saurabpoudel.com.np)** and start converting!

### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/textit.git
cd textit

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

---

## 📖 Usage Guide

### Basic Usage

1. **Enter your text** - Type or paste content into the editor
2. **Choose format** - Click any format button to download
3. **Done!** - File downloads instantly

### Advanced Features

#### 🎹 Keyboard Shortcuts
- `Ctrl/Cmd + S` - Quick save as TXT
- `Ctrl/Cmd + K` - Toggle statistics panel

#### 📂 Drag & Drop
Simply drag any text file onto the app and it'll load automatically!

#### 🎭 Text Transformations
- **UPPERCASE** - Convert all text to uppercase
- **lowercase** - Convert all text to lowercase
- **Title Case** - Capitalize First Letter Of Each Word
- **Copy** - Copy to clipboard with one click

#### 👁️ Format Preview
Hover over any format card and click the eye icon (👁️) to preview the converted content before downloading.

#### ⚡ Bulk Download
Click "Download All" to get your text in all 8 formats at once!

---

## 🎨 Supported Formats

| Format | Extension | Best For |
|--------|-----------|----------|
| 📄 Plain Text | `.txt` | Universal compatibility |
| 📝 Markdown | `.md` | Documentation, README files |
| 🌐 HTML | `.html` | Web pages, email templates |
| { } JSON | `.json` | Structured data, APIs |
| 📊 CSV | `.csv` | Spreadsheets, data analysis |
| 📋 XML | `.xml` | Data exchange, configs |
| 📑 RTF | `.rtf` | Word processors, formatted text |
| Τ LaTeX | `.tex` | Academic papers, scientific docs |

---

## 🛠️ Tech Stack

- **[Svelte 5](https://svelte.dev/)** - Modern reactive framework with Runes
- **[SvelteKit](https://kit.svelte.dev/)** - Full-stack framework
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Vite](https://vitejs.dev/)** - Lightning-fast build tool
- **Static Adapter** - Deploy anywhere

---

## 🌟 Why TextIt?

### 🤖 Perfect for AI Workflows
- Feed large context to ChatGPT, Claude, or any LLM
- Convert documentation for AI analysis
- Format training data quickly

### 🔒 Privacy First
- **Zero server uploads** - Everything runs in your browser
- **No tracking** - Your data stays yours
- **Open source** - Audit the code yourself

### ⚡ Lightning Fast
- **Instant conversion** - No waiting for server processing
- **Offline capable** - Works without internet after first load
- **No rate limits** - Convert as much as you want

### 🛠️ Developer Friendly
- Quick format switching for configs
- Convert README files
- Generate documentation in multiple formats
- Export data for testing

---

## 📦 Project Structure

```
textit/
├── src/
│   ├── routes/
│   │   └── +page.svelte          # Main app component
│   ├── app.html                   # HTML template
│   └── app.css                    # Global styles
├── static/                        # Static assets
├── svelte.config.js              # SvelteKit config
├── tailwind.config.js            # Tailwind config
├── vite.config.js                # Vite config
└── package.json
```

---

## 🔧 Configuration

### Deployment

TextIt uses `@sveltejs/adapter-static` for deployment. To deploy:

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy the `build` folder** to any static hosting:
   - Vercel
   - Netlify
   - GitHub Pages
   - Cloudflare Pages
   - Your own server

### Environment Variables

No environment variables needed! Everything runs client-side.

---

## 🤝 Contributing

We love contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Ideas for Contributions
- 📝 Add more output formats (PDF, DOCX, etc.)
- 🎨 New themes or UI improvements
- 🌍 Internationalization (i18n)
- 🔧 Text manipulation tools
- 📱 Mobile app version
- ♿ Accessibility improvements

---

## 🐛 Bug Reports

Found a bug? Please open an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS information

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Svelte 5](https://svelte.dev/) - Amazing reactivity with Runes
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Inspired by the need to feed context to AI models efficiently
- Thanks to all contributors!

---

## 📞 Contact & Support

- 🌐 **Live Demo:** [textit.saurabpoudel.com.np](https://textit.saurabpoudel.com.np)
- 💼 **Developer:** [Saurab Poudel](https://saurabpoudel.com.np)
- 🐛 **Issues:** [GitHub Issues](https://github.com/yourusername/textit/issues)
- ⭐ **Star this repo** if you find it useful!

---

<div align="center">

**Made with ❤️ and Svelte 5**

[⬆ Back to Top](#-textit---universal-text-format-converter)

</div>
