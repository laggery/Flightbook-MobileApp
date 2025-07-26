import { AltitudeFlight } from "./altitude-flight";
import { Theory } from "./theory";
import { TrainingHill } from "./training-hill";

export class ControlSheet {
  public id: number | undefined;
  public userCanEdit: boolean | undefined;
  public passTheoryExam: Date | undefined;
  public passPracticeExam: Date | undefined;
  public trainingHill: TrainingHill | undefined;
  public theory: Theory | undefined;
  public altitudeFlight: AltitudeFlight | undefined;
}
