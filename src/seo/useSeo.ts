import { useEffect } from "react";
import { applySeo } from "./applySeo";
import type { SeoRecord } from "./routes";

/** Applies the page's SEO record whenever its content (not its identity) changes. */
export const useSeo = (record: SeoRecord | null): void => {
  const serialized = record ? JSON.stringify(record) : "";
  useEffect(() => {
    if (serialized) applySeo(JSON.parse(serialized) as SeoRecord);
  }, [serialized]);
};
