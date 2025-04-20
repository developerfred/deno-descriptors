import { serve } from "https://deno.land/std@0.204.0/http/server.ts";
import { ChainDescriptors } from "./descriptors.ts";

// In-memory cache of descriptors
const descriptorsCache: Record<string, any> = {};

// Update interval (once per day)
const UPDATE_INTERVAL = 24 * 60 * 60 * 1000;

// Function to update descriptors
async function updateDescriptors() {
  try {
    for (const chain of ChainDescriptors.supportedChains) {
      const descriptor = await ChainDescriptors.fetch(chain);
      descriptorsCache[chain] = descriptor;
    }
    console.log("Descriptors updated successfully");
  } catch (error) {
    console.error("Error updating descriptors:", error);
  }
}

// Initialize descriptors
updateDescriptors();

// Set up periodic updates
setInterval(updateDescriptors, UPDATE_INTERVAL);

// Serve HTTP requests
serve(async (req) => {
  const url = new URL(req.url);
  
  // API endpoint to list available chains
  if (url.pathname === "/api/chains") {
    return new Response(JSON.stringify({
      chains: Object.keys(descriptorsCache)
    }), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
  
  // API endpoint to get a specific chain descriptor
  if (url.pathname.startsWith("/api/descriptor/")) {
    const chain = url.pathname.replace("/api/descriptor/", "");
    
    if (descriptorsCache[chain]) {
      return new Response(JSON.stringify(descriptorsCache[chain]), {
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" 
        }
      });
    }
    
    return new Response(JSON.stringify({ error: "Chain not found" }), {
      status: 404,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      }
    });
  }
  
  // Default response
  return new Response(JSON.stringify({ 
    message: "Blockchain Descriptors API", 
    endpoints: [
      "/api/chains",
      "/api/descriptor/:chain"
    ]
  }), {
    headers: { 
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*" 
    }
  });
});
