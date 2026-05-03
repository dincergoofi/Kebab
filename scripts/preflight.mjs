import { access, readFile, stat } from "node:fs/promises";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const rootPath = fileURLToPath(root);
const requiredFiles = [
  "package.json",
  "index.html",
  "vite.config.js",
  "vercel.json",
  "public/_redirects",
  "public/manifest.webmanifest",
  "public/sw.js",
  "public/qr.html",
  "docs/launch-checklist.md",
  "docs/menu-import-guide.md",
  "docs/customer-demo-brief.md",
  "supabase/migrations/202604130001_initial_schema.sql",
  "supabase/migrations/202605020002_restaurant_profile_columns.sql",
  "supabase/migrations/202605020003_restaurant_admins_and_policies.sql"
];

function rel(path) {
  return new URL(path, root);
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: rootPath,
      shell: false,
      stdio: "inherit"
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} ${args.join(" ")} failed with code ${code}`));
      }
    });
  });
}

async function exists(path) {
  try {
    await access(rel(path));
    return true;
  } catch {
    return false;
  }
}

async function checkFiles() {
  const missing = [];

  for (const file of requiredFiles) {
    if (!(await exists(file))) {
      missing.push(file);
    }
  }

  return missing;
}

async function envStatus() {
  if (!(await exists(".env"))) {
    return {
      level: "warn",
      message: ".env yok. Demo publish icin sorun degil; Supabase admin/live veri icin gerekli."
    };
  }

  const content = await readFile(rel(".env"), "utf8");
  const hasUrl = /^VITE_SUPABASE_URL=.+/m.test(content) && !content.includes("your-project.supabase.co");
  const hasAnon = /^VITE_SUPABASE_ANON_KEY=.+/m.test(content) && !content.includes("your-public-anon-key");

  if (!hasUrl || !hasAnon) {
    return {
      level: "warn",
      message: ".env var ama Supabase URL/anon key eksik veya placeholder gorunuyor."
    };
  }

  return { level: "ok", message: ".env Supabase degerleri dolu gorunuyor." };
}

async function fileSize(path) {
  const info = await stat(rel(path));
  return info.size;
}

async function main() {
  console.log("== Real Kebab deploy preflight ==");

  const missing = await checkFiles();
  if (missing.length) {
    console.error("Eksik dosyalar:");
    missing.forEach((file) => console.error(`- ${file}`));
    process.exitCode = 1;
    return;
  }
  console.log("Dosya kontrolu tamam.");

  const env = await envStatus();
  console.log(`${env.level === "ok" ? "OK" : "UYARI"}: ${env.message}`);

  await run(process.execPath, ["scripts/export-demo-data.mjs"]);
  await run(process.execPath, ["node_modules/vite/bin/vite.js", "build"]);

  const distSize = await fileSize("dist/index.html");
  const qrSize = await fileSize("dist/qr.html");

  console.log("Build ciktisi hazir:");
  console.log(`- dist/index.html (${distSize} bytes)`);
  console.log(`- dist/qr.html (${qrSize} bytes)`);
  console.log("Preflight tamam. Final QR baskisi icin canli domain mobil veriyle test edilmeli.");
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
