# VeriCert - JWT Certificate Verification Platform

> A modern, secure platform for verifying cryptographically signed JWT certificates with an elegant space-themed interface.

![VeriCert](public/brocode-logo.jpg)

## Overview

**VeriCert** is a Next.js-based certificate verification system that allows organizations to issue and verify digitally signed certificates using RS256 (RSA-2048) asymmetric encryption. The platform combines security with a beautiful, intuitive user interface powered by Aceternity UI's Vortex effect.

### Key Features

- 🔐 **RS256 Encryption**: Industry-standard asymmetric cryptography (RSA-2048)
- 📱 **QR Code Scanning**: Extract JWT tokens from embedded QR codes in PDF certificates
- 📄 **PDF Upload**: Drag-and-drop interface for certificate verification
- ⬇️ **Export Options**: Download verified certificates as PDF or PNG
- 🎨 **Modern UI**: Space-themed Vortex background with glassmorphism design
- 🔧 **Custom Key Support**: Configure alternative public keys to verify certificates from other organizations
- 💾 **Local Storage**: Persist custom verification keys in the browser
- 🌐 **Community Links**: Direct integration with BroCode Tech Community and GitHub repository

---

## Technology Stack

### Frontend
- **Next.js 16.1.1** - React framework with App Router
- **React 19.2.3** - UI library
- **Tailwind CSS** - Utility-first styling (Zinc/Neutral dark mode)
- **Framer Motion** - Smooth animations and transitions
- **Aceternity UI** - Advanced UI components (Vortex background)
- **html2canvas** - Convert DOM elements to canvas/images
- **jsPDF** - PDF generation and manipulation
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

### Backend
- **Next.js API Routes** - Serverless function endpoints
- **Jose** - JWT signing and verification (RS256)

### Cryptography
- **Node.js Crypto** - Native cryptographic operations
- **PKCS#8 PEM Format** - Standard key format for RSA keys

### Development
- **TypeScript** - Type-safe development
- **ESLint** - Code quality and style checking
- **Turbopack** - Next.js bundler

---

## Project Structure

```
vericert/
├── app/
│   ├── api/
│   │   └── verify/
│   │       └── route.ts           # JWT verification endpoint
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main landing page & verification UI
├── components/
│   ├── ui/
│   │   ├── background-ripple-effect.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── skeleton.tsx
│   │   ├── sonner.tsx
│   │   ├── textarea.tsx
│   │   └── vortex.tsx              # Aceternity Vortex component
│   ├── certificate-card.tsx        # Certificate display & download
│   ├── pdf-uploader.tsx            # PDF drag-and-drop uploader
│   └── verification-status.tsx     # Valid/Invalid status display
├── lib/
│   ├── jwt.ts                      # JWT verification logic
│   └── utils.ts                    # Utility functions
├── public/
│   ├── brocode-logo.jpg            # BroCode brand logo
│   └── [other static assets]
├── scripts/
│   ├── generate-keys.js            # Generate RSA key pairs
│   └── sign-token.js               # Create test JWT tokens
├── types/
│   └── react-pdf-image-qr-scanner.d.ts
├── .env.local                      # Environment variables
├── next.config.ts                  # Next.js configuration
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
└── tailwind.config.ts              # Tailwind CSS config
```

---

## Getting Started

### Prerequisites
- **Node.js** v18+ (with npm, yarn, pnpm, or bun)
- **pnpm** (recommended) or npm/yarn
- RSA key pair (private.key and public.key)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NotoriousArnav/vericert.git
   cd vericert
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Generate RSA key pair** (if not already present)
   ```bash
   node scripts/generate-keys.js
   ```
   This creates:
   - `private.key` - Private key for signing certificates
   - `public.key` - Public key for verification (stored in env)

4. **Configure environment variables**
   Create or update `.env.local`:
   ```env
   # JWT Public Key for verification
   JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
   [your-public-key-content]
   -----END PUBLIC KEY-----"
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage Guide

### For Certificate Recipients

#### Verify a Certificate via URL
1. Use the QR code embedded in your PDF certificate
2. The link format: `https://vericert.app/?verifyCert=<JWT_TOKEN>`
3. The certificate details will be automatically verified and displayed

#### Verify via File Upload
1. Navigate to the VeriCert homepage
2. Drag and drop your PDF certificate or click to browse
3. The QR code will be automatically extracted and verified
4. View certificate details or download as PDF/PNG

#### Download Your Certificate
After verification, use the orange "Download" button to:
- **Download as PDF** - High-quality printable format
- **Download as PNG** - Image format for sharing on social media

### For Certificate Issuers

#### Create a Test Certificate
```bash
# Edit scripts/sign-token.js with your data
node scripts/sign-token.js
```

Example payload structure:
```javascript
{
  sub: "unique-recipient-id",
  name: "Recipient Name",
  event: "Course or Certification Title",
  iat: 1767652976,                          // Unix timestamp
  issuer: "Your Organization Name",
  certId: "UNIQUE-CERT-ID",
  remarks: "Optional achievement notes",
  // ... any custom fields
}
```

#### Generate Production Keys
```bash
# Generate a new RSA-2048 key pair
node scripts/generate-keys.js
```

#### Configure for Production
1. Store `private.key` securely (offline, encrypted)
2. Add `public.key` content to `JWT_PUBLIC_KEY` environment variable
3. Deploy to production environment

### Custom Verification Keys

For verifying certificates from other organizations:

1. Click the **Settings** button (⚙️) in the top-right corner
2. Paste the organization's public key (PEM format)
3. Click "Save Configuration"
4. Verify certificates will now use the custom key

To reset:
- Click "Reset to Default" in the Settings dialog
- The default BroCode key will be restored

---

## API Reference

### POST /api/verify

Verify a JWT certificate token.

**Request Body:**
```json
{
  "token": "eyJhbGciOiJSUzI1NiJ9...",
  "publicKey": "-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"  // Optional
}
```

**Response (Valid Certificate):**
```json
{
  "valid": true,
  "payload": {
    "sub": "unique-recipient-id",
    "name": "Recipient Name",
    "event": "Course Title",
    "iat": 1767652976,
    "issuer": "BroCode Tech Community",
    "certId": "CERT-ID",
    "remarks": "Achievement notes"
  }
}
```

**Response (Invalid Certificate):**
```json
{
  "valid": false,
  "error": "Error message describing the verification failure"
}
```

**Error Cases:**
- `Invalid token format` - Token is malformed
- `Signature verification failed` - Token was tampered with or signed with different key
- `Token has expired` - Token's validity period has ended (if exp claim present)
- `No public key available` - No verification key configured

---

## Certificate Payload Structure

### Standard Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sub` | String | Yes | Subject identifier (recipient ID) |
| `name` | String | Yes | Full name of certificate recipient |
| `event` | String | Yes | Course, event, or certification title |
| `iat` | Number | Yes | Issued At (Unix timestamp in seconds) |
| `issuer` | String | Yes | Organization issuing the certificate |
| `certId` | String | Yes | Unique certificate identifier |
| `remarks` | String | No | Optional achievement notes or comments |

### Custom Fields

You can add any additional fields to the payload:
```javascript
{
  name: "John Doe",
  event: "Python Mastery",
  iat: Math.floor(Date.now() / 1000),
  issuer: "BroCode Tech Community",
  certId: "BC-2026-001",
  // Custom fields
  gpa: 4.0,
  completionDate: "2026-01-06",
  specialization: "Backend Development"
}
```

All custom fields will be displayed in the "Cryptographic Payload" section of the certificate card.

---

## Security Considerations

### Key Management

1. **Private Key Security**
   - Never commit `private.key` to version control
   - Store in secure, encrypted environment
   - Rotate keys periodically
   - Use `private.key` only on secure, isolated systems

2. **Public Key Distribution**
   - Safe to share and distribute publicly
   - Include in environment variables
   - Publish on your website/documentation

3. **Token Validity**
   - Tokens are cryptographically signed and cannot be forged
   - Tampering with any certificate data will fail verification
   - QR code extraction is secure (client-side only)

### Verification Process

The verification uses **RS256** (RSA-2048) algorithm:
1. Token header and payload are base64-encoded
2. Signature is created using private key
3. Verification confirms:
   - Token wasn't modified
   - Signature matches the public key
   - Token format is valid

### Client-Side Security

- Custom public keys are stored in **localStorage**
- Keys are only sent to the verification API
- No keys are transmitted to external servers
- All verification happens either client-side (QR extraction) or server-side (JWT validation)

---

## Deployment

### Vercel Deployment (Recommended)

1. Push to GitHub
   ```bash
   git push origin main
   ```

2. Import project to Vercel
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your GitHub repository
   - Configure environment variables:
     - `JWT_PUBLIC_KEY`: Your public key

3. Deploy
   ```bash
   vercel --prod
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t vericert .
docker run -p 3000:3000 -e JWT_PUBLIC_KEY="..." vericert
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `JWT_PUBLIC_KEY` | Yes | RSA public key in PEM format |

---

## Development Scripts

```bash
# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run TypeScript type checking
pnpm type-check

# Run linting
pnpm lint

# Generate new RSA key pair
node scripts/generate-keys.js

# Create and sign a test token
node scripts/sign-token.js
```

---

## Certificate Card Features

### Display Elements
- **Holographic Top Border** - Animated gradient (Cyan → Purple → Pink)
- **Recipient Name** - Large, centered display
- **Issuer Badge** - Organization name with building icon
- **Issue Date** - Formatted date from JWT `iat` claim
- **Verification Status** - Green "Verified" badge
- **Cryptographic Payload** - Syntax-highlighted JSON view

### Export Options
1. **Download as PDF**
   - Full certificate in printable format
   - High resolution (2x scale)
   - Black background maintained
   - Filename: `{RecipientName}-certificate.pdf`

2. **Download as PNG**
   - Certificate as high-quality image
   - Suitable for digital sharing
   - Transparent areas handled with black background
   - Filename: `{RecipientName}-certificate.png`

---

## UI Components

### Vortex Background
- **Source**: Aceternity UI
- **Effect**: Animated particle vortex with glow
- **Colors**: Cool blue hues (Base Hue: 220°)
- **Configuration**:
  - 500 particles
  - 800px vertical range
  - Blur and brightness filters for glow effect

### CertificateCard Component
- **Animations**: Fade-in + Scale (0.9 → 1.0)
- **Transitions**: 500ms duration
- **Interactive**: JSON lines with type tooltips
- **Responsive**: Mobile-first design (mobile, tablet, desktop)

### PDFUploader Component
- **Drag & Drop**: Full support with visual feedback
- **File Input**: Click to browse alternative
- **QR Extraction**: Automatic QR code detection
- **Toast Notifications**: Success/error feedback

### Dialog (Settings)
- **Purpose**: Configure custom public keys
- **Storage**: localStorage persistence
- **Features**: 
  - Textarea for key input
  - Clear/reset functionality
  - Validation feedback

---

## Troubleshooting

### "Certificate Verified" but "Issued Date" is undefined
**Solution**: Ensure the JWT payload includes the `iat` (Issued At) claim as a Unix timestamp.

### QR Code not detected in PDF
**Solution**: 
- Ensure the QR code is properly embedded in the PDF
- Check that the QR code contains a valid verify link: `?verifyCert=<TOKEN>`
- Try uploading a different certificate

### "Signature verification failed"
**Solution**:
- Verify the correct public key is configured
- Ensure the token wasn't modified or corrupted
- Check that the token was signed with the correct private key

### Custom public key not working
**Solution**:
- Ensure the key is in valid PEM format
- Start with: `-----BEGIN PUBLIC KEY-----`
- End with: `-----END PUBLIC KEY-----`
- Check browser console for detailed error messages

### Download button not working
**Solution**:
- Ensure pop-ups are not blocked
- Check browser console for errors
- Verify sufficient disk space
- Try a different browser

---

## Browser Support

- **Chrome/Edge**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Mobile Browsers**: iOS Safari, Chrome Mobile

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

---

## License

MIT License - see LICENSE file for details

---

## Support & Links

- **GitHub**: [NotoriousArnav/vericert](https://github.com/NotoriousArnav/vericert.git)
- **BroCode**: [brocode-tech.netlify.app](https://brocode-tech.netlify.app)
- **Issues**: [GitHub Issues](https://github.com/NotoriousArnav/vericert/issues)

---

## Changelog

### v1.0.0 (Current)
- ✅ Core JWT verification with RS256 encryption
- ✅ QR code extraction from PDF certificates
- ✅ Beautiful space-themed UI with Vortex effect
- ✅ PDF and PNG export functionality
- ✅ Custom public key configuration
- ✅ Local storage persistence
- ✅ Responsive design
- ✅ Toast notifications
- ✅ Extensive documentation

---

**Made with ❤️ by BroCode Tech Community**
