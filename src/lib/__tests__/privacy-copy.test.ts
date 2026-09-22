import { describe, expect, it } from "vitest";

import { privacyNoticeBody } from "../privacy-copy";

describe("privacy notice", () => {
  it("discloses Google Analytics 4 and states ads are not currently shown", () => {
    const text = privacyNoticeBody.join(" ");
    expect(text).toContain("Google Analytics 4");
    expect(text).toContain("googletagmanager.com");
    expect(text).not.toMatch(/analytics.{0,40}not currently/i);
    expect(text).toContain("does not currently show ads");
  });
});
