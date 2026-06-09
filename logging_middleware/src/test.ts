import { Log } from "./logger";

async function testLogger() {
  const result = await Log(
    "backend",
    "info",
    "service",
    "Logger middleware initialized successfully"
  );

  console.log(result);
}

testLogger();