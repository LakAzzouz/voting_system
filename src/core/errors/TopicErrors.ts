import { DomainErrors } from "./DomainErrors";

export namespace TopicErrors {
  export class TopicNotFound extends DomainErrors {
    constructor() {
      super("TOPIC_NOT_FOUND");
    }
  }
}
