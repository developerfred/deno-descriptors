// List of supported chains
const SUPPORTED_CHAINS = [
  "dot", "ksm", "wnd", "roc", "paseo", 
  "polkadotAssetHub", "kusamaAssetHub"
];

// Source descriptors (could be your GitHub repo or other storage)
const DESCRIPTOR_SOURCE = "https://raw.githubusercontent.com/developerfred/deno-descriptors/main/public/descriptors";

export const ChainDescriptors = {
  supportedChains: SUPPORTED_CHAINS,
  
  // Fetch a chain descriptor from the source
  async fetch(chain: string): Promise<any> {
    try {
      const response = await fetch(`${DESCRIPTOR_SOURCE}/${chain}.json`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch descriptor for ${chain}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching descriptor for ${chain}:`, error);
      throw error;
    }
  }
};
