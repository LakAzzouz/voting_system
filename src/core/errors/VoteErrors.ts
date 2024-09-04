import { DomainErrors } from "./DomainErrors";

export namespace VoteErrors {
  export class NotFound extends DomainErrors {
    constructor() {
      super("VOTE_NOT_FOUND");
    }
  }
}
