const { SignJWT, importPKCS8 } = require('jose');
const fs = require('fs');

async function main() {
  const privateKeyPem = fs.readFileSync('private.key', 'utf8');
  const privateKey = await importPKCS8(privateKeyPem, 'RS256');

  const payload = {
    sub: 'arnav-ghosh-001',
    name: 'Arnav Ghosh',
    event: 'BroCode Protocols: The Django & API Bootcamp',
    iat: Math.floor(Date.now() / 1000),
    issuer: 'BroCode Tech Community',
    certId: 'BC-2026-ARNAV-001',
    remarks: 'Excelent Job with that Pornhub Clone you Made'
  };

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'RS256' })
    .sign(privateKey);

  console.log("Here is a signed RS256 token for testing:");
  console.log(token);
  console.log("\nVerify link:");
  console.log(`http://localhost:3000/?verifyCert=${token}`);
}

main();
