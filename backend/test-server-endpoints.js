
import("./server.js").then(() => {
  setTimeout(async () => {
    try {
      console.log("Testing /health...");
      const res1 = await fetch("http://localhost:5000/health");
      console.log("Health response:", res1.status, await res1.json());

      console.log("\nTesting /department...");
      const res2 = await fetch("http://localhost:5000/department");
      console.log("Department response:", res2.status, await res2.json());
    } catch (err) {
      console.error("Test failed:", err);
    } finally {
      process.exit(0);
    }
  }, 1000);
});
