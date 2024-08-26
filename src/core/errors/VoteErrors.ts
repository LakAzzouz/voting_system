import { DomainErrors } from "./DomainErrors";

export namespace VoteErrors {
  export class VoteNotFound extends DomainErrors {
    constructor() {
      super("VOTE_NOT_FOUND");
    }
  }
}
