const { SignJWT, importPKCS8 } = require('jose');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

/**
 * Parse TSV file properly handling quoted multiline fields
 */
function parseTSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  if (lines.length === 0) throw new Error('Empty TSV file');
  
  // Parse header
  const headers = lines[0].split('\t').map(h => h.trim());
  console.log(`📌 Headers: ${headers.join(', ')}`);
  
  const records = [];
  let i = 1;
  
  while (i < lines.length) {
    const line = lines[i];
    
    // Skip empty lines
    if (!line.trim()) {
      i++;
      continue;
    }
    
    // Split the line by tabs
    const parts = line.split('\t');
    
    // Check if we have all columns
    if (parts.length < headers.length) {
      console.warn(`⚠️  Warning: Line ${i} has fewer columns than header, skipping`);
      i++;
      continue;
    }
    
    // Create record
    const record = {};
    for (let j = 0; j < headers.length; j++) {
      let value = parts[j] || '';
      
      // Check if this field is quoted and incomplete (multiline)
      if (value.startsWith('"') && !value.endsWith('"')) {
        // This field spans multiple lines
        i++;
        while (i < lines.length) {
          value += '\n' + lines[i];
          if (lines[i].includes('"')) {
            break;
          }
          i++;
        }
      }
      
      // Remove surrounding quotes
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      
      record[headers[j]] = value.trim();
    }
    
    // Only add if has essential fields
    if (record.Name && (record['Email Address'] || record.Email)) {
      records.push(record);
      console.log(`  ✓ Parsed: ${record.Name}`);
    }
    
    i++;
  }
  
  return records;
}

/**
 * Sanitize string for use in filenames and IDs
 */
function sanitize(str) {
  return str.replace(/[^a-zA-Z0-9-_]/g, '').substring(0, 50);
}

/**
 * Generate certificate for a person
 */
async function generateCertificate(person, index, privateKey) {
  const name = person.Name || 'Unknown';
  const email = person['Email Address'] || person.Email || 'unknown@example.com';
  const remarks = person.Remarks || 'Excellent work!';
  
  // Create payload (without remarks to keep URL/QR code compact)
  const payload = {
    sub: email.replace(/[@.]/g, '-'),
    name: name.trim(),
    event: 'BroCode Protocols: The Django & API Bootcamp',
    iat: Math.floor(Date.now() / 1000),
    remarks: remarks.trim(),
    issuer: 'BroCode Tech Community',
    certId: `BC-2026-${sanitize(name).toUpperCase()}-${String(index + 1).padStart(3, '0')}`
  };

  // Sign JWT
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'RS256' })
    .sign(privateKey);

  return { payload, token };
}

/**
 * Generate QR code for token
 */
async function generateQRCode(token, outputPath, filename) {
  const verifyUrl = `https://vericert.neopanda.tech/?verifyCert=${token}`;
  
  // Generate QR code PNG
  await QRCode.toFile(
    path.join(outputPath, filename),
    verifyUrl,
    {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    }
  );
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('🔐 Loading private key...');
    const privateKeyPem = fs.readFileSync('private.key', 'utf8');
    const privateKey = await importPKCS8(privateKeyPem, 'RS256');
    
    console.log('📋 Parsing data.tsv...');
    const records = parseTSV('data.tsv');
    console.log(`✓ Found ${records.length} certificate(s) to generate\n`);
    
    // Ensure output directory exists
    const outputDir = 'data/images';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`📁 Created output directory: ${outputDir}\n`);
    }
    
    // Generate certificates
    const results = [];
    for (let i = 0; i < records.length; i++) {
      const person = records[i];
      console.log(`⚙️  Processing [${i + 1}/${records.length}]: ${person.Name}`);
      
      try {
        // Generate JWT
        const { payload, token } = await generateCertificate(person, i, privateKey);
        
        // Generate QR code
        const sanitizedName = sanitize(person.Name.replace(/\s+/g, '-'));
        const filename = `${sanitizedName}-certificate.png`;
        await generateQRCode(token, outputDir, filename);
        
        results.push({
          name: person.Name,
          email: person['Email Address'] || person.Email,
          certId: payload.certId,
          filename,
          token,
          verifyUrl: `https://vericert.neopanda.tech/?verifyCert=${token}`,
          remarks: person.Remarks || ''
        });
        
        console.log(`  ✓ Generated: ${filename}`);
        console.log(`  📱 Token: ${token.substring(0, 20)}...${token.substring(token.length - 20)}`);
        console.log();
      } catch (err) {
        console.error(`  ✗ Error: ${err.message}`);
      }
    }
    
    // Save results summary
    const summaryPath = path.join(outputDir, 'certificates-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2));
    console.log(`📊 Summary saved to: ${summaryPath}`);
    
    // Create CSV export for reference
    const csvPath = path.join(outputDir, 'certificates.csv');
    const csvHeader = 'Name,Email,Certificate ID,QR Code File,Verification Link,Remarks\n';
    const csvRows = results.map(r => 
      `"${r.name}","${r.email}","${r.certId}","${r.filename}","${r.verifyUrl}","${r.remarks}"`
    ).join('\n');
    fs.writeFileSync(csvPath, csvHeader + csvRows);
    console.log(`📄 CSV exported to: ${csvPath}`);
    
    console.log(`\n✅ Successfully generated ${results.length} certificate(s)!`);
    console.log(`\n📂 Output directory: ${outputDir}/`);
    console.log(`   - QR Code images (*.png)`);
    console.log(`   - certificates-summary.json (JWT tokens & metadata)`);
    console.log(`   - certificates.csv (reference spreadsheet)`);
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
