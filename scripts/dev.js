import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("\x1b[32m%s\x1b[0m", "🌱 Starting FieldShift Full-Stack Development Services...");
console.log("\x1b[36m%s\x1b[0m", "   • Backend API:  http://localhost:5000");
console.log("\x1b[36m%s\x1b[0m", "   • Next.js App:  http://localhost:3000");

const backend = spawn("node", ["server.js"], {
  cwd: path.join(rootDir, "backend"),
  stdio: "inherit",
  env: { ...process.env, PORT: "5000" },
});

const frontend = spawn("npm", ["run", "dev"], {
  cwd: path.join(rootDir, "frontend"),
  stdio: "inherit",
  env: { ...process.env, PORT: "3000" },
});

const cleanup = () => {
  console.log("\nShutting down FieldShift services...");
  try { backend.kill("SIGTERM"); } catch (_) {}
  try { frontend.kill("SIGTERM"); } catch (_) {}
  process.exit(0);
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
process.on("exit", cleanup);
