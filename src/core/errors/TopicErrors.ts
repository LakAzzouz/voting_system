import { DomainErrors } from "./DomainErrors";

export namespace TopicErrors {
  export class NotFound extends DomainErrors {
    constructor() {
      super("TOPIC_NOT_FOUND");
    }
  }
}
