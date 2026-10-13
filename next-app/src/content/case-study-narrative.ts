export type NarrativeMedia =
  | { kind: "real"; src: string; alt: string; caption?: string }
  | { kind: "placeholder"; caption: string };

export type NarrativeSection = {
  sub: string;
  heading: string;
  body: string[];
  media?: NarrativeMedia[];
};

export type NarrativeStat = {
  value: string;
  label: string;
};

export type CaseStudyNarrative = {
  objective: string;
  sections: NarrativeSection[];
  compromise?: {
    heading?: string;
    body: string[];
    media?: NarrativeMedia[];
  };
  outcome?: {
    stats: NarrativeStat[];
    body: string[];
    media?: NarrativeMedia[];
  };
};

export const caseStudyNarrative: Record<string, CaseStudyNarrative> = {
  "a-clientelling-app": {
    objective:
      "Give luxury sales associates one place to turn what they know about a client into a personalized, shareable product edit, without leaving the app.",
    sections: [
      {
        sub: "Where it started",
        heading: "A team that shipped whatever the client asked for that week",
        body: [
          "Before this project, the roadmap was a queue of client requests, worked in order. No research informed what got built next, and no design system held the screens together as the product grew.",
          "Lookbook was the first feature scoped from research instead of a client ask. It was the test of whether this team could work a different way.",
        ],
      },
      {
        sub: "Talking to Sales Associates",
        heading: "17 interviews with the people who would use it every day",
        body: [
          "I ran a mixed-method research pass: hour-long Zoom interviews with 5 internal SMEs and 12 sales associates from luxury and retail brands, plus in-person workshops with existing clients. The brief was to define KPIs for associates and store managers, find automation opportunities inside the app, and test whether online touchpoints now shape how clients expect to be served in store.",
          "I mapped the findings by theme and laid them against the business strategy, so research and roadmap were judged together rather than in separate decks. Two findings carried the most weight. Associates juggled in-store clients, online inquiries and admin with no integrated tool to move between them. And personalization lived in paper notebooks: a favorite color, a past purchase, written by hand because the app had nowhere to keep it, so the same preferences were gathered from the same client again and again.",
        ],
        media: [
          {
            kind: "real",
            src: "/images/case-studies/clientelling-app/interview-insights-affinity-map.png",
            alt: "Interview insights affinity map, organized by theme",
            caption: "The affinity map from the 17 interviews, organized by theme and checked against business strategy.",
          },
          {
            kind: "real",
            src: "/images/case-studies/clientelling-app/persona-thea-ncube.png",
            alt: "Thea Ncube persona: 29, luxury sales associate, London",
            caption: "Thea Ncube, 29, a London associate serving Chanel and Hermès clients. Short on a system, not on relationships.",
          },
        ],
      },
      {
        sub: "Choosing the Bet",
        heading: "Why Lookbook came first",
        body: [
          "Both findings pointed at the same gap: associates had the relationship, but no single place to turn what they knew about a client into something they could send. A lookbook, a curated edit built for one client and shared from inside the app, answered both at once. It pulled catalogue, client notes and outreach into one flow, and it was the most visible way to make personalization feel like luxury service instead of generic retail software.",
        ],
      },
      {
        sub: "Scoping the MVP",
        heading: "One journey first: creating a new lookbook",
        body: [
          "I mapped the full journey, the create, edit and share paths plus every hand-off to catalogue, wishlist, basket and comms, then cut the MVP down to the single highest-value path: creating a new lookbook. Everything else stayed mapped but deliberately unbuilt.",
          "Once creation worked, the next real need was reuse. Associates rarely build a lookbook from nothing, so we added duplicating an existing one, mixing in new products, and a public view a client can open directly, all as extensions of the same flow rather than separate features.",
        ],
        media: [
          {
            kind: "real",
            src: "/images/case-studies/clientelling-app/ia-diagram-lookbook-journeys.png",
            alt: "Information architecture diagram: create, edit, and share lookbook journeys",
            caption: "The full IA, with conditions and hand-offs to other modules mapped. Only the create path shipped in the MVP.",
          },
          {
            kind: "real",
            src: "/images/case-studies/clientelling-app/lookbook-mvp-screens.png",
            alt: "My Lookbook, Product Detail Page, Lookbook Review, and Lookbook Preview screens",
            caption: "What the MVP shipped as: My Lookbook, Product Detail Page, Lookbook Review and Lookbook Preview.",
          },
          {
            kind: "real",
            src: "/images/case-studies/clientelling-app/lookbook-duplicate-mix-match.png",
            alt: "Centralised Lookbook, Duplicate a Lookbook, Mix and Match, and reply-through-Lookbook screens",
            caption: "Reuse, not just creation: a shared library, duplicating a lookbook, mixing in products, and replying to a client from it.",
          },
        ],
      },
      {
        sub: "A Multi-Brand Design System",
        heading: "One system shared by design and engineering",
        body: [
          "The same app had to carry several clients' brands, so I built the design system from scratch on design tokens: one set of components, themed per brand through variables, instead of a copy of the app for each client. I owned it end to end, across iOS and web.",
          "The tokens and component documentation became the contract between design and engineering. Engineers started from them at hand-off, and the docs were detailed enough that clients could configure features themselves without a designer in the loop.",
          "Guerrilla tests with sales associates showed they needed a much simpler information hierarchy than we had assumed to read a screen without training. Rather than fixing that screen by screen, we wrote it into the system as a content and layout guideline, so every new screen starts from it.",
        ],
        media: [
          {
            kind: "real",
            src: "/images/case-studies/clientelling-app/design-tokens-component-docs.png",
            alt: "Design tokens (variables) and component documentation for multi-brand configuration",
            caption: "Design tokens for multi-brand theming, and the component documentation clients use to configure features themselves.",
          },
        ],
      },
    ],
    compromise: {
      body: [
        "We shipped without a place to store client preferences, even though it was the second-biggest pain in our research. Associates still keep a client's favorite colors and past purchases in paper notebooks, because the app has nowhere to put them. Building it properly was out of scope for this phase, and it is the clearest gap between what Thea needs and what we shipped.",
        "Moving the lookbook preview from a PDF export to an in-app HTML view created a harder problem: showing a lookbook consistently inside an email. With the Tech Lead we tested the existing options, and each failed in a way that mattered. Some held on to client data in ways we were not comfortable with, others rendered differently across email clients. We built our own HTML email template on Bootstrap instead. It cost more engineering time up front than a plug-in, and we took that cost because inconsistent rendering in a client's inbox was not acceptable for a luxury brand.",
      ],
      media: [
        {
          kind: "real",
          src: "/images/case-studies/clientelling-app/email-rendering-comparison.png",
          alt: "Comparison of email/HTML rendering solutions considered, ending in a self-hosted Bootstrap template",
          caption: "Every option we evaluated (Contentful, Catalogue Machine, Webflow, FlipHTML5, PDF exports) and why we self-hosted an HTML/Bootstrap template instead.",
        },
      ],
    },
    outcome: {
      stats: [
        { value: "5,500+", label: "new users onboarded in 3 months, post-V2" },
        { value: "25%", label: "increase in customer satisfaction" },
        { value: "57%", label: "less build time than a comparable feature built before the design system" },
      ],
      body: [
        "The 57% is the number I am proudest of, and the one I can claim the least direct credit for. It compares Lookbook with a feature of similar scope built before the design system. The product didn't get smaller, the work did: with components and tokens already in place, far less had to be built from scratch, and the team no longer needed me in every decision.",
        "Lookbook shipped in V2 with the surfaces it hands off to (Clientbook, Basket, Omnichannel outreach and appointments), alongside a Comms module and a new Filter that I also worked on.",
      ],
      media: [
        {
          kind: "real",
          src: "/images/case-studies/clientelling-app/client-basket-appointment-omnichannel-v2.png",
          alt: "View Client Details, Flow to Basket, Appointment, and Omnichannel Support screens",
          caption: "The surfaces Lookbook hands off to: client details, the flow into basket, the appointment dashboard and omnichannel outreach.",
        },
      ],
    },
  },

  
"autopilot": {
    objective:
      "How do you move an agentic workflow from a hallway demo to general availability — by cutting features, not adding them?",
    sections: [
      {
        sub: "The Rewrite",
        heading: "One screen, four jobs, and none of them done well",
        body: [
          "Autopilot picked up a feature every time someone had a reasonable idea in a hallway conversation. By the time I looked at it straight on, one screen was trying to be a dashboard, an inbox, a drafting tool, and an approval queue at once. Nothing in it was wrong on its own — together, it didn't do any one job well.",
          "I listed every task a BD rep actually did in a week, ranked by frequency, and threw out the layout rather than patch it again. The current version does one thing per screen. That's the whole story of this phase: not a redesign, a subtraction.",
        ],
      },
      {
        sub: "What Interviews Changed",
        heading: "Two assumptions BD reps broke in the first session",
        body: [
          "I sat with the reps who'd actually use this and watched how they ran a deal, instead of trusting my own assumptions. Two assumptions broke immediately: they didn't want the agent deciding anything for them, only drafting something they could judge in one glance — and the three seconds right after a request fired mattered more than the eventual output, because that's where people decided whether to trust the tool at all.",
          "Both became concrete interaction changes: an explicit draft-review state, and a visible, specific \"working\" state instead of a spinner.",
        ],
      },
      {
        sub: "Designing for Inference",
        heading: "What the screen shows while a model is still thinking",
        body: [
          "The harder conversations with engineering weren't about pixels. They were about what the screen shows while a model is still producing output — streaming partial structure instead of a loading state, and treating an in-progress run as its own designed state rather than a placeholder bolted onto the finished view.",
          "This is also where I got strict with myself about generic AI-feature chrome — card grids and chat bubbles that could belong to anything. Every state here had to come from what this specific workflow needed, not from what \"AI UI\" usually looks like.",
        ],
      },
      {
        sub: "The Alignment Doc",
        heading: "A narrative doc instead of a roadmap deck",
        body: [
          "There was no budget line for \"rebuild the information architecture.\" I wrote a short narrative — what a rep's day looked like once this shipped, written like a press release for something that didn't exist yet — instead of a roadmap deck with options. One point of view, specific enough that people several levels up could agree with it or push back on something real.",
        ],
      },
      {
        sub: "Finding My Role",
        heading: "Earning the room to make product calls, not just execute them",
        body: [
          "Part of this project was figuring out where I actually sat — not handing off specs, not purely executing someone else's call either. I earned the room to make product decisions by being right about small ones first, and stayed aligned with where the company was actually headed rather than where I personally found the problem most interesting. That tension is still the most interesting part of this work.",
        ],
      },
    ],
    compromise: {
      body: [
        "Palantir's own Autopilot documentation is candid about a real limitation of this approach: a workflow with a large number of automations can use more memory and slow the browser down, since the board is visualizing everything live rather than paginating it. That's the honest tradeoff of the direction I pushed for — fewer, denser views over more, lighter ones — and it isn't fully resolved.",
      ],
    },
    outcome: {
      stats: [
        { value: "GA", label: "generally available, up from an internal demo" },
        { value: "1 → N", label: "information architecture rebuilt from scratch, not patched" },
        { value: "1 doc", label: "narrative doc that unlocked headcount without a roadmap deck" },
      ],
      body: [
        "Autopilot is now generally available and used every month, not a hallway demo. The design work that mattered wasn't visual — it was cutting back, repeatedly, to what the product was actually for.",
      ],
    },
  },

  "osdk-component-library": {
    objective:
      "Can an existing component library be driven declaratively without a rewrite?",
    sections: [
      {
        sub: "Mapping the Composition Models",
        heading: "Naming the actual mismatch",
        body: [
          "react-components was built for imperative composition — you call it from JSX, screen by screen. json-render wants to describe a screen as a schema and have the framework assemble it. Before writing any adapter code, I mapped exactly where those two models disagreed: prop-drilling patterns that assumed a parent component already existed, state that lived outside what a schema could describe, event handlers wired by hand instead of declared.",
        ],
      },
      {
        sub: "Prototyping the Adapter Layer",
        heading: "Building the smallest thing that could fail honestly",
        body: [
          "I built a thin adapter layer that let a json-render schema instantiate react-components under the hood, then threw real BD-surface layouts at it rather than toy examples — because a mismatch that only shows up on real screens is the one that actually matters to teams deciding whether to adopt this.",
        ],
      },
      {
        sub: "Stress-Testing Where It Breaks",
        heading: "Working the actual disagreements with engineering",
        body: [
          "The valuable sessions with engineering weren't about whether the adapter worked in the happy path — it did, quickly. They were about finding the specific patterns where it silently produced the wrong behavior: components that read internal state react-components expected to own directly, which a declarative schema has no clean way to express.",
        ],
      },
    ],
    compromise: {
      body: [
        "I scoped the investigation to the common composition patterns — roughly the ones used across most BD surfaces — and explicitly did not attempt full backward compatibility for every existing react-components usage. That means some teams with more unusual, deeply imperative screens will still need custom adapter work or a partial rewrite; I made the call that a fast, honest answer for the common case was worth more than a slow, complete one that tried to cover every edge case up front.",
      ],
    },
    outcome: {
      stats: [
        { value: "Proven", label: "feasible for the common BD-surface composition patterns" },
        { value: "0 rewrites", label: "needed for the common case — same components, driven by a schema instead" },
      ],
      body: [
        "This answered the question it was scoped to answer — whether the common case needs a rewrite — without yet producing a rollout number I can point to. That's the honest gap in this one: it's a proof of feasibility, not a measured adoption delta.",
      ],
    },
  },
};
