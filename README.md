# PingPeak Chrome Extension 🔔

A lightweight Chrome extension that monitors website availability and displays real-time status using color-coded indicators in your browser toolbar.

## Features

- 🎯 Real-time website monitoring
- 🚦 Color-coded status indicators:
  - 🟢 Green: All monitored sites are up
  - 🟡 Amber: Some sites are experiencing delays
  - 🔴 Red: One or more sites are down
- ⚡ Response time tracking
- 💾 Synced settings across Chrome instances
- 🔍 Detailed status popup view

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

The extension monitors sites at regular intervals. You can manage your monitored URLs through the options page:
- Add/remove sites to monitor
- View response times
- Check last status update

## Development

Requirements:
- Chrome Browser
- Basic understanding of Chrome Extension APIs

To set up the development environment:

1. Clone the repository
2. Make your changes
3. Test locally by loading the unpacked extension
4. Submit a pull request

## Structure

```
PingPeak/
├── icons/
│   ├── green.png
│   ├── amber.png
│   ├── red.png
│   └── default.png
├── background.js
├── popup.html
├── popup.js
├── options.html
├── options.js
└── manifest.json
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