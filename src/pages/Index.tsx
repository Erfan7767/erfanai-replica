import { useEffect } from "react";
import ErfanReplica from "@/components/ErfanAI_Replica";
import { trackEvent } from "@/hooks/useAnalyticsTracker";

const Index = () => {
  useEffect(() => {
    trackEvent("page_view", "page_view", { title: document.title });
  }, []);
  return <ErfanReplica />;
};

export default Index;
