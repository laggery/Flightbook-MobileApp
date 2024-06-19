/// <reference lib="webworker" />

// import { scoringRules, solver } from "igc-xc-score";

addEventListener('message', async({ data }) => {
  self["global"] = self;
  const { scoringRules, solver } = await import('igc-xc-score');
  const result: XCScoring.Solution = solver(data, scoringRules.XCScoring, {}).next().value;
  const response = {
    optimal: result.optimal,
    scoreInfo: result.scoreInfo,
    opt: {
      flight: {
        fixes: result.opt.flight.fixes,
        ll: result.opt.flight["ll"]
      }
    }
  }
  postMessage(response);
});
