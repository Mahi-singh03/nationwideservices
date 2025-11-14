export async function POST(request) {
  try {
    const { message, conversationId } = await request.json();
    
    // Enhanced input validation
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return new Response(
        JSON.stringify({ 
          error: "Please provide a valid message",
          suggestion: "Ask about courses, admissions, fees, or any other institute information"
        }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validate message length
    if (message.length > 1000) {
      return new Response(
        JSON.stringify({ 
          error: "Message too long",
          suggestion: "Please keep your question under 1000 characters"
        }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ 
          error: "Service temporarily unavailable",
          suggestion: "Please contact the institute directly for immediate assistance"
        }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Load knowledge base with caching
    let knowledgeBase;
    try {
      knowledgeBase = await import("../../components/skillup-knowledge.json")
        .then((module) => module.default)
        .catch(() => {
          throw new Error("Knowledge base not available");
        });
    } catch (error) {
      console.error("Failed to load knowledge base:", error);
      return new Response(
        JSON.stringify({ 
          error: "Service configuration issue",
          suggestion: "Please contact the institute directly for accurate information"
        }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Model configuration with fallbacks
    const requestedModel = (process.env.GOOGLE_MODEL || "gemini-2.0-flash").trim();
    
    function resolveModelAndVersion(modelId) {
      const modelConfigs = {
        "gemini-pro": { model: "gemini-1.0-pro", apiVersion: "v1beta" },
        "gemini-2.0-flash": { model: "gemini-2.0-flash", apiVersion: "v1" },
        "gemini-1.5-flash": { model: "gemini-1.5-flash", apiVersion: "v1" },
        "gemini-1.0-pro": { model: "gemini-1.0-pro", apiVersion: "v1beta" }
      };
      
      return modelConfigs[modelId] || { model: modelId, apiVersion: "v1" };
    }

    // Enhanced prompt with structured context
    const enhancedPrompt = `
You are a helpful AI assistant for Skill Up Institute of Learning. Your role is to provide accurate, friendly, and professional information about the institute.

INSTITUTE CONTEXT:
${JSON.stringify(knowledgeBase, null, 2)}

USER QUESTION: "${message}"

RESPONSE GUIDELINES:
1. PRIMARY FOCUS: Use the knowledge base above to answer questions about:
   - Courses, durations, fees, and departments
   - Admission process, intakes, and eligibility
   - Contact information and institute details
   - Placement assistance and support
   - Distance education programs

2. RESPONSE STYLE:
   - Be warm, professional, and encouraging
   - Use clear, simple language with proper formatting
   - Break complex information into bullet points when helpful
   - Always maintain a positive tone about the institute

3. BOUNDARIES:
   - If information is not in the knowledge base, politely admit it and suggest contacting the institute
   - For unrelated topics, gently redirect to institute services
   - Never invent or hallucinate information not present in the knowledge base

4. FORMATTING:
   - Use emojis sparingly to make responses engaging
   - Structure information logically
   - End with an encouraging note or next steps

Please provide a helpful, accurate response based on the knowledge base:
`;

    // Model discovery and fallback system
    async function listModels(targetVersion) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const resp = await fetch(
          `https://generativelanguage.googleapis.com/${targetVersion}/models?key=${encodeURIComponent(apiKey)}`,
          { 
            method: "GET",
            signal: controller.signal
          }
        );
        clearTimeout(timeoutId);
        
        if (!resp.ok) return { models: [], errorText: await resp.text(), status: resp.status };
        const json = await resp.json();
        return { models: Array.isArray(json?.models) ? json.models : [] };
      } catch (error) {
        return { models: [], error: error.message };
      }
    }

    function pickClosestSupportedModel(models, desiredModelId) {
      const desiredBase = desiredModelId.replace(/-latest$/, "");
      const isGood = (m) => Array.isArray(m?.supportedGenerationMethods) && m.supportedGenerationMethods.includes("generateContent");
      
      // Exact match
      const exact = models.find((m) => m.name?.endsWith(`/models/${desiredModelId}`) && isGood(m));
      if (exact) return desiredModelId;
      
      // Latest version
      const exactLatest = models.find((m) => m.name?.endsWith(`/models/${desiredBase}-latest`) && isGood(m));
      if (exactLatest) return `${desiredBase}-latest`;
      
      // Same family
      const family = desiredBase.split("-").slice(0, 3).join("-");
      const sameFamily = models
        .filter((m) => m.name?.includes(`/models/${family}`) && isGood(m))
        .map((m) => m.name.split("/models/").pop());
      if (sameFamily.length > 0) return sameFamily[0];
      
      // Any working model
      const anyGenerate = models.find(isGood);
      return anyGenerate ? anyGenerate.name.split("/models/").pop() : null;
    }

    async function callGenerateContent(targetModel, targetVersion) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const resp = await fetch(
          `https://generativelanguage.googleapis.com/${targetVersion}/models/${encodeURIComponent(
            targetModel
          )}:generateContent?key=${encodeURIComponent(apiKey)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({ 
              contents: [{ 
                role: "user", 
                parts: [{ text: enhancedPrompt }] 
              }],
              generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
              }
            }),
          }
        );
        clearTimeout(timeoutId);
        return resp;
      } catch (error) {
        return new Response(JSON.stringify({ error: "Request timeout" }), { status: 408 });
      }
    }

    // Resolve model and version
    const envVersion = process.env.GOOGLE_API_VERSION && process.env.GOOGLE_API_VERSION.trim();
    const { model, apiVersion } = envVersion
      ? { model: requestedModel, apiVersion: envVersion }
      : resolveModelAndVersion(requestedModel);

    // Primary API call attempt
    let attemptModel = model;
    let attemptVersion = apiVersion;
    let upstream = await callGenerateContent(attemptModel, attemptVersion);

    // Enhanced fallback logic
    if (!upstream.ok && upstream.status === 404) {
      console.log(`Model ${attemptModel} not found, attempting fallbacks...`);
      
      const fallbackStrategies = [
        { model: `${attemptModel}-latest`, version: attemptVersion },
        { model: attemptModel, version: attemptVersion === "v1" ? "v1beta" : "v1" },
        { model: "gemini-1.5-flash-latest", version: "v1" },
        { model: "gemini-1.0-pro-latest", version: "v1beta" }
      ];

      for (const strategy of fallbackStrategies) {
        const resp = await callGenerateContent(strategy.model, strategy.version);
        if (resp.ok) {
          upstream = resp;
          attemptModel = strategy.model;
          attemptVersion = strategy.version;
          console.log(`Fallback successful: ${attemptModel} on ${attemptVersion}`);
          break;
        }
      }

      // Final attempt: discover available models
      if (!upstream.ok) {
        const preferredOrder = [attemptVersion, attemptVersion === "v1" ? "v1beta" : "v1"];
        for (const ver of preferredOrder) {
          const { models } = await listModels(ver);
          if (models && models.length) {
            const picked = pickClosestSupportedModel(models, attemptModel) || 
                          pickClosestSupportedModel(models, "gemini-1.5-flash") ||
                          pickClosestSupportedModel(models, "gemini-pro");
            if (picked) {
              const tryResp = await callGenerateContent(picked, ver);
              if (tryResp.ok) {
                upstream = tryResp;
                attemptModel = picked;
                attemptVersion = ver;
                break;
              }
            }
          }
        }
      }
    }

    // Handle upstream errors gracefully
    if (!upstream.ok) {
      const errorText = await upstream.text();
      console.error("Gemini API error:", upstream.status, errorText);
      
      let userFriendlyError = {
        error: "I'm having trouble processing your request right now",
        suggestion: "Please try again in a moment, or contact the institute directly for immediate assistance",
        contact: knowledgeBase.contact
      };

      // Specific error handling
      if (upstream.status === 429) {
        userFriendlyError = {
          error: "Service is busy",
          suggestion: "Please wait a moment and try again",
          contact: knowledgeBase.contact
        };
      } else if (upstream.status === 403) {
        userFriendlyError = {
          error: "Service temporarily unavailable",
          suggestion: "Please contact the institute directly for assistance",
          contact: knowledgeBase.contact
        };
      }

      return new Response(JSON.stringify(userFriendlyError), {
        status: 200, // Return 200 to avoid breaking the chat interface
        headers: { "Content-Type": "application/json" },
      });
    }

    // Process successful response
    const data = await upstream.json();
    const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 
      `I apologize, but I'm having trouble generating a response right now. 

For accurate and immediate information about Skill Up Institute, please:

📞 Call: ${knowledgeBase.contact.phone.join(" or ")}
📧 Email: ${knowledgeBase.contact.email}
🌐 Visit: ${knowledgeBase.contact.website}

Our team will be happy to assist you with any questions about courses, admissions, or fees!`;

    return new Response(
      JSON.stringify({ 
        reply: botReply,
        metadata: {
          model: attemptModel,
          timestamp: new Date().toISOString(),
          conversationId: conversationId || null
        }
      }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      },
    });

  } catch (error) {
    console.error("Server error:", error);
    
    const userFriendlyError = {
      error: "Something went wrong on our end",
      suggestion: "Please try again in a few moments, or contact us directly for assistance",
      contact: {
        phone: ["98551-46491", "94639-26371"],
        email: "info@skillupinstitute.co.in"
      }
    };

    return new Response(JSON.stringify(userFriendlyError), {
      status: 200, // Return 200 to maintain chat flow
      headers: { "Content-Type": "application/json" },
    });
  }
}