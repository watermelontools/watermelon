export function getLineDiffs(filePatch: string) {
    const additions: string[] = [];
    const removals: string[] = [];
  
    // Split the patch into lines
    const lines = filePatch.split("\n");
  
    // Loop through lines
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
  
      // Check if entering a deletion block
      if (line.startsWith("-")) {
        removals.push(line.replace("-", "").trim());
      }
  
      // Check if exiting a deletion block
      if (line.startsWith("+")) {
        additions.push(line.replace("+", "").trim());
      }
    }
    return { additions: additions.join("\n"), removals: removals.join("\n") };
  }