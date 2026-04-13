import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MODEL_MAP: Record<string, string> = {
  "ErfanAI Max": "google/gemini-2.5-pro",
  "ErfanAI Pro": "google/gemini-2.5-flash",
  "ErfanAI Lite": "google/gemini-2.5-flash-lite",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, model, chatMode, knowledgeContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const aiModel = MODEL_MAP[model] || "google/gemini-3-flash-preview";

    // Build system prompt based on chat mode + knowledge context
    let systemContent =
      "أنت ErfanAI، مساعد ذكاء اصطناعي متقدم ومتعدد المهام. أنت تساعد المستخدمين في البرمجة، التصميم، الكتابة، التحليل، وأي مهمة أخرى. أجب بلغة المستخدم. كن دقيقاً ومفيداً ومحترفاً. استخدم Markdown للتنسيق عند الحاجة.";

    // Inject knowledge base context
    if (knowledgeContext && typeof knowledgeContext === "string" && knowledgeContext.trim()) {
      systemContent += `\n\nسياق من قاعدة معرفة المستخدم (استخدمه عند الحاجة):\n${knowledgeContext}`;
    }

    switch (chatMode) {
      case "creative":
        systemContent +=
          " كن أكثر إبداعاً وخيالاً في إجاباتك. استخدم استعارات وأمثلة مبتكرة.";
        break;
      case "precise":
        systemContent +=
          " كن دقيقاً جداً ومركزاً على الحقائق. تجنب الافتراضات وقدم مصادر عند الإمكان.";
        break;
      case "code":
        systemContent +=
          " أنت متخصص في البرمجة. اكتب كوداً نظيفاً ومعلقاً. اشرح المنطق البرمجي بوضوح.";
        break;
      default:
        break;
    }

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: aiModel,
          messages: [
            { role: "system", content: systemContent },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "تم تجاوز حد الطلبات. يرجى المحاولة لاحقاً.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error: "يرجى إضافة رصيد لحسابك لمتابعة الاستخدام.",
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "حدث خطأ في خدمة الذكاء الاصطناعي" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "حدث خطأ غير معروف",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
