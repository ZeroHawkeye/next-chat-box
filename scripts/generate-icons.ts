import sharp from "sharp";
import pngToIco from "png-to-ico";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const svgPath = join(__dirname, "../public/icon.svg");
const iconsDir = join(__dirname, "../src-tauri/icons");

// 读取 SVG 文件
const svgBuffer = readFileSync(svgPath);

// 定义需要生成的尺寸
const sizes = [
  { name: "32x32.png", size: 32 },
  { name: "128x128.png", size: 128 },
  { name: "128x128@2x.png", size: 256 },
  { name: "icon.png", size: 512 },
  // Windows Store logos
  { name: "Square30x30Logo.png", size: 30 },
  { name: "Square44x44Logo.png", size: 44 },
  { name: "Square71x71Logo.png", size: 71 },
  { name: "Square89x89Logo.png", size: 89 },
  { name: "Square107x107Logo.png", size: 107 },
  { name: "Square142x142Logo.png", size: 142 },
  { name: "Square150x150Logo.png", size: 150 },
  { name: "Square284x284Logo.png", size: 284 },
  { name: "Square310x310Logo.png", size: 310 },
  { name: "StoreLogo.png", size: 50 },
];

// ICO 文件需要的尺寸
const icoSizes = [16, 24, 32, 48, 64, 128, 256];

async function generateIcons() {
  console.log("Generating icons from SVG...\n");

  for (const { name, size } of sizes) {
    const outputPath = join(iconsDir, name);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`Generated ${name} (${size}x${size})`);
  }

  // 生成 ICO 文件需要的临时 PNG 文件
  console.log("\nGenerating ICO file...");
  const tempPngPaths: string[] = [];
  
  for (const size of icoSizes) {
    const tempPath = join(iconsDir, `_temp_${size}.png`);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(tempPath);
    tempPngPaths.push(tempPath);
  }

  // 使用 png-to-ico 生成正确格式的 ICO 文件
  const icoBuffer = await pngToIco(tempPngPaths);
  writeFileSync(join(iconsDir, "icon.ico"), icoBuffer);
  console.log("Generated icon.ico (multi-size)");

  // 清理临时文件
  const fs = await import("fs/promises");
  for (const tempPath of tempPngPaths) {
    await fs.unlink(tempPath);
  }
  console.log("Cleaned up temporary files");

  console.log("\nAll icons generated successfully!");
  console.log("\nNote: For production ICNS (macOS), use: npx tauri icon public/icon.svg");
}

generateIcons().catch(console.error);
