
import { GoogleGenAI, Type } from "@google/genai";
import { ResearchResult } from "../types";

export const performResearch = async (companies: string[]): Promise<ResearchResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemPrompt = `
    You are a Data Extraction API for the Indian IT Market.
    Target Companies: ${companies.join(", ")}.

    STRICT SALARY SOURCE RULES:
    1. You MUST estimate the MEDIAN CTC in INR LPA.
    2. Use ONLY publicly available data from these aggregators: Glassdoor, Naukri, AmbitionBox, Indeed, Levels.fyi, 6figr.
    3. Label all salary data internally as: "Estimate – based on public salary aggregator data".
    4. For Part A (Company Table): Provide ONLY the MEDIAN value. Format: "X.X LPA" (e.g., "5.8 LPA").
    5. For Part B (Benchmark Table): Provide both the Median and the 25th-75th Percentile Range.

    OTHER DATA RULES:
    1. 'ops' field: Describe BUSINESS OPERATIONS (e.g., "Cloud Consulting", "BPM Services"). NO locations.
    2. 'segment': Sector type (e.g., "Service-based", "Product-based").
    3. REPETITION: Stop immediately after closing the JSON. No conversational filler.
    4. MISSING DATA: Use "(Industry Median Est)" if company-specific data is unavailable.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Generate a median CTC research report for: ${companies.join(", ")}. Use Glassdoor, Naukri, AmbitionBox, Indeed, Levels.fyi, and 6figr as your primary salary sources.`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        maxOutputTokens: 6000, 
        thinkingConfig: { thinkingBudget: 1500 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            partA: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  company: { type: Type.STRING },
                  segment: { type: Type.STRING },
                  ops: { type: Type.STRING },
                  revenueUsdBn: { type: Type.STRING },
                  revenueInrCr: { type: Type.STRING },
                  employeesApprox: { type: Type.STRING },
                  parentCompany: { type: Type.STRING },
                  verificationStatus: { type: Type.STRING },
                  glassdoorRating: { type: Type.STRING },
                  naukriRating: { type: Type.STRING },
                  linkedinRating: { type: Type.STRING },
                  tester_0_2: { type: Type.STRING, description: "Median CTC LPA from aggregators" },
                  tester_2_5: { type: Type.STRING, description: "Median CTC LPA from aggregators" },
                  tester_5_10: { type: Type.STRING, description: "Median CTC LPA from aggregators" },
                  cyber_0_2: { type: Type.STRING, description: "Median CTC LPA from aggregators" },
                  cyber_2_5: { type: Type.STRING, description: "Median CTC LPA from aggregators" },
                  cyber_5_10: { type: Type.STRING, description: "Median CTC LPA from aggregators" },
                  devops_0_2: { type: Type.STRING, description: "Median CTC LPA from aggregators" },
                  devops_2_5: { type: Type.STRING, description: "Median CTC LPA from aggregators" },
                  devops_5_10: { type: Type.STRING, description: "Median CTC LPA from aggregators" },
                  software_0_2: { type: Type.STRING, description: "Median CTC LPA from aggregators" },
                  software_2_5: { type: Type.STRING, description: "Median CTC LPA from aggregators" },
                  software_5_10: { type: Type.STRING, description: "Median CTC LPA from aggregators" },
                  fieldSources: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        field: { type: Type.STRING },
                        url: { type: Type.STRING },
                        sourceName: { type: Type.STRING },
                        asOf: { type: Type.STRING }
                      }
                    }
                  }
                },
                required: ["company", "ops", "fieldSources"]
              }
            },
            partB: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  role: { type: Type.STRING },
                  expBand: { type: Type.STRING },
                  medianCtc: { type: Type.STRING },
                  typicalRange: { type: Type.STRING },
                  sources: { type: Type.STRING }
                }
              }
            },
            sources: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  section: { type: Type.STRING },
                  links: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        label: { type: Type.STRING },
                        url: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            },
            verificationLog: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  agent: { type: Type.STRING },
                  check: { type: Type.STRING },
                  status: { type: Type.STRING },
                  details: { type: Type.STRING }
                }
              }
            },
            overallConfidenceScore: { type: Type.INTEGER },
            dataCoverage: { type: Type.INTEGER }
          },
          required: ["partA", "partB", "sources", "verificationLog", "overallConfidenceScore", "dataCoverage"]
        },
        tools: [{ googleSearch: {} }],
        temperature: 0,
      },
    });

    let jsonText = response.text || "";
    const firstBrace = jsonText.indexOf('{');
    const lastBrace = jsonText.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1) throw new Error("Invalid JSON response");
    jsonText = jsonText.substring(firstBrace, lastBrace + 1);

    const parsed = JSON.parse(jsonText);
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const urls = groundingChunks.map((chunk: any) => chunk.web?.uri).filter((uri: string | undefined): uri is string => !!uri);

    return {
      partA: parsed.partA || [],
      partB: parsed.partB || [],
      sources: parsed.sources || [],
      groundingUrls: Array.from(new Set(urls)),
      verificationLog: parsed.verificationLog || [],
      overallConfidenceScore: parsed.overallConfidenceScore || 0,
      dataCoverage: parsed.dataCoverage || 0,
    };
  } catch (error: any) {
    console.error("Research Error:", error);
    throw error;
  }
};
