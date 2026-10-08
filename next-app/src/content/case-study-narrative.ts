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
      "How might we enable sales associates to deliver personalized, visually engaging product recommendations efficiently, while enhancing the customer experience and driving in-store sales?",
    sections: [
      {
        sub: "Where it started",
        heading: "A team moving fast with no product mindset",
        body: [
          "Before this, the team shipped on request: whatever the client asked for that week became the next sprint. There was no design system holding screens together as the product grew, and no research informing what got built next — just a queue of client asks, worked in order.",
          "Lookbook was the first project scoped from research instead of a client request — the test of whether this team could work a different way.",
        ],
      },
      {
        sub: "Talking to Sales Associates",
        heading: "17 interviews, two formats, one question underneath them",
        body: [
          "We ran a mixed-method research pass: 5 internal SMEs and 12 external sales associates from luxury and retail brands, each in roughly hour-long Zoom sessions, plus in-person workshops with existing clients.",
          "The brief was to define KPIs for store associates and managers, find automation opportunities inside the app, and understand the omnichannel experience in luxury retail specifically — including testing the hypothesis that online touchpoints were becoming a bigger part of how clients expect to be served, even inside a physical store relationship.",
        ],
        media: [
          {
            kind: "real",
            src: "/images/case-studies/clientelling-app/interview-insights-affinity-map.png",
            alt: "Interview insights affinity map, organized by theme",
            caption: "The affinity map from the 17 interviews, organized by theme and checked against business strategy.",
          },
        ],
      },
      {
        sub: "Mapping the Insights",
        heading: "Organizing what we heard against what the business needed",
        body: [
          "I built an affinity map of the interview findings, organized by theme, and laid that same map against our business strategy so the two weren't developed in isolation from each other.",
          "Two findings carried the most weight: sales associates were juggling in-store clients, online inquiries, and a dozen other tasks with no integrated tools to move between them, and they relied on basic notes — favorite colors, past purchases — with no deeper system for real personalization, which meant re-gathering the same preferences from the same client over and over.",
          "That second finding got a name: Thea Ncube, 29, a luxury sales associate in London working with Chanel and Hermès clients. She wasn't short on relationships — she was short on a system, juggling client threads across a notebook, a messaging app, and memory, with nothing that read as luxury-appropriate rather than generic retail software.",
        ],
        media: [
          {
            kind: "real",
            src: "/images/case-studies/clientelling-app/persona-thea-ncube.png",
            alt: "Thea Ncube persona — 29, luxury sales associate, London",
            caption: "Thea Ncube — the persona that came out of the research: motivations, pains, and needs.",
          },
        ],
      },
      {
        sub: "Information Architecture for the Lookbook MVP",
        heading: "Scoping to one journey: creating a new lookbook",
        body: [
          "I mapped the full user journey — the create, edit, and share paths, plus every condition and portal out to other modules (catalogue, wishlist, basket, comms) — then scoped the MVP down to the single highest-value path: creating a new lookbook. Everything else stayed mapped but deliberately unbuilt for this phase.",
        ],
        media: [
          {
            kind: "real",
            src: "/images/case-studies/clientelling-app/ia-diagram-lookbook-journeys.png",
            alt: "Information architecture diagram — create, edit, and share lookbook journeys",
            caption: "The full IA: create, edit, and share lookbook journeys, with conditions and portals to other modules mapped out.",
          },
          {
            kind: "real",
            src: "/images/case-studies/clientelling-app/lookbook-mvp-screens.png",
            alt: "My Lookbook, Product Detail Page, Lookbook Review, and Lookbook Preview screens",
            caption: "What the scoped-down MVP actually shipped as: My Lookbook, Product Detail Page, Lookbook Review, and Lookbook Preview.",
          },
        ],
      },
      {
        sub: "Beyond one lookbook",
        heading: "Duplicating, mixing, and sharing a lookbook publicly",
        body: [
          "Once the core creation flow worked, the next real need was reuse: an associate rarely builds one lookbook from nothing every time. We added the ability to duplicate an existing lookbook and mix and match products into it, and a public-facing view a client could open directly — extending the same MVP flow rather than bolting on a separate feature.",
        ],
        media: [
          {
            kind: "real",
            src: "/images/case-studies/clientelling-app/lookbook-duplicate-mix-match.png",
            alt: "Centralised Lookbook, Duplicate a Lookbook, Mix and Match, and reply-through-Lookbook screens",
            caption: "Reuse, not just creation: a centralised public library, duplicating a lookbook, mixing and matching products, and replying to a client straight from it.",
          },
        ],
      },
      {
        sub: "A Design System Built to Carry Multiple Brands",
        heading: "Owning the system, not just the feature",
        body: [
          "Because the same app needed to support multiple clients' brand identities, I built the design system from scratch as a cross-platform, multi-brand system using design tokens, and owned it end to end.",
          "That included comprehensive component documentation — detailed enough that clients could configure features themselves using our guidelines, and clear enough to work as the handover point between design and engineering. Alongside the components, I updated our stock imagery using AI tooling for a consistent visual foundation, and did the font selection work to keep typography consistent across every brand's instance of the product.",
          "Some of what went into the system came directly from testing with real sales associates: guerrilla sessions on early content and layout showed people needed a much simpler information hierarchy than we'd assumed to understand a screen without training. Rather than fix that once, we turned it into a content and layout guideline baked into the system itself, so every future screen inherits that clarity by default.",
        ],
        media: [
          {
            kind: "real",
            src: "/images/case-studies/clientelling-app/design-tokens-component-docs.png",
            alt: "Design tokens (variables) and component documentation for multi-brand configuration",
            caption: "Design tokens for multi-brand customization, and the component documentation clients use to configure features themselves.",
          },
        ],
      },
      {
        sub: "What shipped around it",
        heading: "Lookbook didn't ship alone",
        body: [
          "V2 shipped Lookbook alongside a Comms module and a new Filter — both of which I also worked on — plus the surrounding product surface: Clientbook for client purchase history and favorites, Basket for adding items and applying discounts, and Omnichannel for reaching clients across channels and scheduling appointments. Lookbook was the centerpiece, but it worked because the surfaces around it existed too.",
        ],
        media: [
          {
            kind: "real",
            src: "/images/case-studies/clientelling-app/client-basket-appointment-omnichannel-v2.png",
            alt: "View Client Details, Seamless Flow to Basket, Appointment, and Omnichannel Support screens",
            caption: "The surfaces Lookbook hands off to: client details, a seamless flow to basket, the appointment dashboard, and omnichannel outreach.",
          },
        ],
      },
    ],
    compromise: {
      body: [
        "Partway through, we moved the lookbook preview from a PDF export to an in-app HTML view — and that pivot created a real problem: displaying a lookbook consistently inside an email. We tested several existing solutions with the Tech Lead, and every one failed in a way that mattered — some held onto client data in ways we weren't comfortable with, others simply didn't render the same way across email clients. We ended up building our own HTML email template from scratch, using Bootstrap, instead of using any vendor solution. That cost more upfront engineering time than a plug-in would have, and it was the right call anyway, because consistent rendering across clients' inboxes was non-negotiable for a luxury brand experience.",
        "Second compromise, smaller but real: we shipped without persistent customer-preference memory. Associates still re-enter a client's favorite colors or past purchases each time rather than the system remembering — building that properly was out of scope for this phase, and it's the clearest gap between what Thea actually needs and what we shipped.",
      ],
      media: [
        {
          kind: "real",
          src: "/images/case-studies/clientelling-app/email-rendering-comparison.png",
          alt: "Comparison of email/HTML rendering solutions considered, ending in a self-hosted Bootstrap template",
          caption: "Every option we evaluated — Contentful, Catalogue Machine, Webflow, FlipHTML5, PDF exports — and why we ended up self-hosting our own HTML/Bootstrap template instead.",
        },
      ],
    },
    outcome: {
      stats: [
        { value: "5,500+", label: "new users onboarded in 3 months, post-V2" },
        { value: "25%", label: "increase in customer satisfaction" },
        { value: "57%", label: "reduction in development time" },
      ],
      body: [
        "The 57% figure is the one I'm proudest of, and the one I can claim the least direct credit for — it's the effect of the design system working as intended: teams shipping faster without needing me in the loop for every decision. The PM and product leader's feedback on this project specifically called out the research rigor and how well design worked across the cross-functional team, including with engineering.",
      ],
    },
  },
};
