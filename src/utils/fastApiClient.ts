export async function analyzeQuote(quoteId: string) {
  // Real version would be something like:
  // const response = await fetch('http://localhost:8000/analyze', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ quote_id: quoteId }),
  // });
  // if (!response.ok) throw new Error('FastAPI request failed');
  // return response.json();

  // MOCKED for this assignment:
  return {
    risk: "Medium",
    missing_items: ["Structural drawings", "Load requirements"],
    confidence: 91,
  };
}