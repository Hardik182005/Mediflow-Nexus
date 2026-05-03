export interface PitchDeck {
  slide1: { headline: string; subline: string };
  slide2: { title: string; pain_points: string[]; key_stat: string };
  slide3: { title: string; consequences: string[]; revenue_at_risk: string };
  slide4: { solution_line: string; steps: string[] };
  slide5: { title: string; proof_points: string[] };
  slide6: { current_loss: string; savings: string; payback_period: string; year1_roi: string };
  slide7: { integration_title: string; tech_points: string[] };
  slide8: { cta: string; contact: string };
}
