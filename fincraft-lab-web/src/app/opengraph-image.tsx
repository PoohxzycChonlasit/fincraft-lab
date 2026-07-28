import { ImageResponse } from "next/og";
import { FINCRAFT_BRAND } from "@/components/brand/fincraft-brand";
import { FinCraftMark } from "@/components/brand/fincraft-logo";

export const alt = FINCRAFT_BRAND.defaultTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: `linear-gradient(135deg, ${FINCRAFT_BRAND.colors.darkBackground}, #0d2a36)`,
          color: "#fffaf0",
          display: "flex",
          height: "100%",
          justifyContent: "space-between",
          padding: "88px 96px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 30, width: 760 }}>
          <div style={{ alignItems: "center", display: "flex", gap: 22 }}>
            <FinCraftMark labelled style={{ color: FINCRAFT_BRAND.colors.darkTheme, height: 72, width: 72 }} />
            <div style={{ display: "flex", fontSize: 42, fontWeight: 800 }}>
              FinCraft&nbsp;<span style={{ color: FINCRAFT_BRAND.colors.accent }}>Lab</span>
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 68, fontWeight: 800, lineHeight: 1.05 }}>
            Financial literacy becomes a discovery lab.
          </div>
          <div style={{ color: "#b8cfce", display: "flex", fontSize: 28, lineHeight: 1.4 }}>
            Combine ideas, uncover connections, and test simplified real-world scenarios.
          </div>
        </div>
        <div
          style={{
            alignItems: "center",
            background: "rgba(255, 248, 236, 0.96)",
            border: "3px solid rgba(20, 184, 166, 0.65)",
            borderRadius: 54,
            color: FINCRAFT_BRAND.colors.lightTheme,
            display: "flex",
            height: 260,
            justifyContent: "center",
            width: 260,
          }}
        >
          <FinCraftMark labelled style={{ height: 190, width: 190 }} />
        </div>
      </div>
    ),
    size,
  );
}
