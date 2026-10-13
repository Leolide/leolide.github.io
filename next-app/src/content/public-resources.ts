// Public resources for work entries whose detailed write-up is locked
// (NDA / internal) but that have a public-facing artifact worth linking
// to anyway — official docs, a demo video, a public Storybook, etc.
// Shown on the PasswordGate so a visitor without the password still has
// somewhere real to go.
export type PublicResource = { label: string; href: string };

export const publicResources: Record<string, PublicResource[]> = {
  autopilot: [
    { label: "Palantir Autopilot docs", href: "https://www.palantir.com/docs/foundry/autopilot/overview" },
  ],
  "osdk-component-library": [
    { label: "Watch the walkthrough", href: "https://youtu.be/O7aeOmnbCuo" },
    { label: "Browse the Storybook", href: "https://palantir.github.io/osdk-ts/storybook/?path=%2Fdocs%2Fdocs-welcome--docs" },
  ],
};
