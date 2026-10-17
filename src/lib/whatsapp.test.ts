import { afterEach, describe, expect, it, vi } from "vitest";
import { buildWhatsAppUrl, getWhatsAppNumber, parseWhatsAppNumber } from "./whatsapp";

describe("WhatsApp configuration", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("accepts an international number made of digits only", () => {
    expect(parseWhatsAppNumber("261340000000")).toBe("261340000000");
    expect(parseWhatsAppNumber("  33612345678 ")).toBe("33612345678");
  });

  it.each([undefined, "", "   ", "+261340000000", "261 34 00 000 00", "0340000000", "26134abc0000", "1234567", "1234567890123456", "261-340-000-00"])(
    "rejects %j",
    (value) => {
      expect(parseWhatsAppNumber(value)).toBeUndefined();
    },
  );

  it("reads the Vite variable and hides WhatsApp when it is absent or invalid", () => {
    vi.stubEnv("VITE_WHATSAPP_NUMBER", "");
    expect(getWhatsAppNumber()).toBeUndefined();
    vi.stubEnv("VITE_WHATSAPP_NUMBER", "+33 6 12 34 56 78");
    expect(getWhatsAppNumber()).toBeUndefined();
    vi.stubEnv("VITE_WHATSAPP_NUMBER", "33612345678");
    expect(getWhatsAppNumber()).toBe("33612345678");
  });

  it("builds the official click-to-chat URL with an encoded message", () => {
    const url = buildWhatsAppUrl("33612345678", "Bonjour, j’ai un projet & une question ?");
    expect(url.startsWith("https://wa.me/33612345678?text=")).toBe(true);
    const text = new URL(url).searchParams.get("text");
    expect(text).toBe("Bonjour, j’ai un projet & une question ?");
    expect(url).not.toContain(" ");
    expect(url).not.toContain("&une");
  });
});
