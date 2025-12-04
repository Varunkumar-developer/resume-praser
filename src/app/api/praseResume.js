import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export default async function praseResume(
  extractedText,
  setExtractedText,
  setStructuredData,
  setLoader,
  setFileName
) {
  // Define the exact JSON schema for the resume output
  const resumeSchema = {
    type: Type.OBJECT,

    properties: {
      Name: {
        type: Type.STRING,
        description: "The full name of the candidate.",
      },
      Phone: {
        type: Type.STRING,
        description:
          "The primary phone number of the candidate, including country code if available.",
      },
      Email: {
        type: Type.STRING,
        description: "The primary email address of the candidate.",
      },
      Skills: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
        description:
          "A comprehensive list of key technical and soft skills (e.g., Python, React, Teamwork).",
      },
      Education: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            Degree: {
              type: Type.STRING,
              description:
                "The name of the degree or qualification (e.g., M.S. in Computer Science, B.Tech, High School Diploma).",
            },
            Institution: {
              type: Type.STRING,
              description:
                "The name of the educational institution (e.g., Harvard University).",
            },
            Dates: {
              type: Type.STRING,
              description:
                "The start and end dates of the study period (e.g., 2018 - 2022).",
            },
          },
          required: ["Degree", "Institution"],
        },
        description: "A list of the candidate's educational background.",
      },
      // ✅ NEW: Projects Section
      Projects: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            Title: {
              type: Type.STRING,
              description: "The name of the project.",
            },
            Summary: {
              type: Type.STRING,
              description:
                "A one or two-sentence description of the project and its goal.",
            },
            TechStack: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
              description:
                "A list of key technologies or languages used in the project (e.g., Python, TensorFlow).",
            },
          },
          required: ["Title", "Summary"],
        },
        description:
          "A list of the candidate's professional or personal projects.",
      },
    },
    // Specify the fields that MUST be in the final JSON output
    // ✅ Updated required fields
    required: ["Name", "Email", "Skills", "Education", "Projects"],
  };

  const prompt = `
        You are a highly accurate resume parsing assistant.
        Parse the following raw text from a resume and extract the structured data as a JSON object.
        Ensure the output strictly follows the provided JSON schema. If a field cannot be found, use null,
        but prioritize filling all 'required' fields from the schema.

        RESUME TEXT:
        ---
        ${extractedText}
        ---
    `;

  try {
    const response = await ai.models.generateContent({
      // gemini-2.5-flash is excellent for fast, structured data extraction
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        // IMPORTANT: Tells the model to return a valid JSON object
        responseMimeType: "application/json",
        responseSchema: resumeSchema,
      },
    });

    // The response.text is expected to be a JSON string
    const structuredData = JSON.parse(response.text);

    // If a setter was provided (e.g., from a React component), call it
    if (typeof setStructuredData === "function") {
      setStructuredData(structuredData);
       setLoader(false);
       setExtractedText('');
       setFileName('');
    }

    // Return the structured data to the caller
    return structuredData;
   
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Rethrow so the caller can handle the error
    throw new Error(
      error?.message || "Failed to parse resume using Gemini API"
    );
    setLoader(false);
    setExtractedText('');
    setFileName('');
  }
}
