export type CaseStudySlide = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const caseStudySlides: Record<string, CaseStudySlide[]> = {
  "a-clientelling-app": [
    {
      src: "/images/case-studies/clientelling-app/user-flow-lookbook-creation.jpeg",
      width: 1999,
      height: 1124,
      alt: "User flow — streamlining the lookbook creation journey",
    },
    {
      src: "/images/case-studies/clientelling-app/user-flow-public-lookbook.jpeg",
      width: 1999,
      height: 1124,
      alt: "User flow — public lookbook, duplicate and mix and match",
    },
    {
      src: "/images/case-studies/clientelling-app/user-flow-checkout-appointment.jpeg",
      width: 1998,
      height: 1124,
      alt: "User flow — online checkout and appointment booking",
    },
    {
      src: "/images/case-studies/clientelling-app/design-system.jpeg",
      width: 1998,
      height: 1124,
      alt: "Design system — design tokens and component documentation",
    },
  ],
};
