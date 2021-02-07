import { Publisher, ExpirationCompleteEvent, Subjects } from "@nlazzos/gittix-common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
