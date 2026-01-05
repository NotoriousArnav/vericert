const { generateKeyPair, exportPKCS8, exportSPKI } = require('jose');
const fs = require('fs');

async function main() {
  console.log("Generating RS256 Key Pair...");
  
  // Set extractable: true to allow exporting the keys
  const { publicKey, privateKey } = await generateKeyPair('RS256', {
    modulusLength: 2048,
    extractable: true,
  });

  const privatePem = await exportPKCS8(privateKey);
  const publicPem = await exportSPKI(publicKey);

  console.log("\n🔑 PRIVATE KEY (Keep this safe! Use it to sign tokens):");
  console.log(privatePem);
  
  console.log("\n🔒 PUBLIC KEY (Put this in your .env.local):");
  console.log(publicPem);

  // Save to files for convenience
  fs.writeFileSync('private.key', privatePem);
  fs.writeFileSync('public.key', publicPem);
  console.log("\n✅ Keys saved to 'private.key' and 'public.key'");
}

main();
