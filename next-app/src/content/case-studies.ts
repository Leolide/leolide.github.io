export type CaseStudySlide = {
  src: string;
  alt: string;
};

export const caseStudySlides: Record<string, CaseStudySlide[]> = {
  "a-clientelling-app": [
    {
      src: "/images/case-studies/clientelling-app/user-flow-lookbook-creation.jpeg",
      alt: "User flow — streamlining the lookbook creation journey",
    },
    {
      src: "/images/case-studies/clientelling-app/user-flow-public-lookbook.jpeg",
      alt: "User flow — public lookbook, duplicate and mix and match",
    },
    {
      src: "/images/case-studies/clientelling-app/user-flow-checkout-appointment.jpeg",
      alt: "User flow — online checkout and appointment booking",
    },
    {
      src: "/images/case-studies/clientelling-app/design-system.jpeg",
      alt: "Design system — design tokens and component documentation",
    },
  ],
};
