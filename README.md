# PingPeak Chrome Extension 🔔

A lightweight Chrome extension that monitors website availability and displays real-time status using color-coded indicators in your browser toolbar.

## Features

- 🎯 Real-time website monitoring with custom names
- 🚦 Color-coded status indicators:
  - 🟢 Green: All sites up (successful on first try)
  - 🟡 Amber: Some sites flaky (succeeded after retries)
  - 🔴 Red: One or more sites down (failed after retries)
- ⚡ Response time tracking and monitoring
- ⚙️ Per-site configurable settings:
  - 🕒 Check intervals (30s to 1h)
  - ⏱️ Timeout thresholds (1s to 30s)
  - � Retry attempts (0 to 5)
- �💾 Synced settings across Chrome instances
- 🔍 Detailed status popup view with friendly names

## Installation

1. Clone this repository:
```bash
git clone https://github.com/danjonesio/PingPeak.git
```

2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the PingPeak directory

## Usage

1. Click the PingPeak icon in your Chrome toolbar
2. Open the options page (right-click → Options)
3. Add the URLs you want to monitor
4. The extension will automatically start monitoring your sites

## Configuration

Easily configure your monitoring through the options page:
- Add/remove sites to monitor (up to 5 sites)
- Set friendly names for each monitored site
- Customize per-site settings:
  - Check frequency (30 seconds to 1 hour)
  - Request timeout (1 to 30 seconds)
  - Number of retry attempts (0 to 5)
- View real-time response times
- Track last status update
- Auto-sync across all Chrome instances

## Development

### Requirements
- Chrome Browser
- Basic understanding of Chrome Extension APIs
- Knowledge of Chrome Extension Manifest V3

### Development Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/danjonesio/PingPeak.git
```

2. Navigate to Chrome Extensions:
- Open Chrome and go to `chrome://extensions/`
- Enable "Developer mode" in the top right
- Click "Load unpacked" and select the PingPeak directory

### Testing
- Monitor background service worker in extension's DevTools
- Check popup/options pages in their respective DevTools
- Use the Logger utility for debugging
- Run unit tests (coming soon)

## Structure

```
PingPeak/
├── icons/              # Status icons in multiple sizes
│   ├── 16/            # 16x16 icons
│   ├── 32/            # 32x32 icons
│   ├── 48/            # 48x48 icons
│   ├── 128/           # 128x128 icons
│   └── resize_icons.sh # Icon resizing script
├── utils/
│   └── logger.js      # Logging utility
├── tests/
│   └── background.test.js  # Unit tests
├── background.js      # Service worker for monitoring
├── popup.html        # Status display view
├── popup.js         # Status display logic
├── options.html     # Configuration page
├── options.js      # Settings management
└── manifest.json   # Extension configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Chrome Extension documentation
- Contributors and testers

## Support

If you encounter any problems or have feature requests, please file an issue on GitHub.