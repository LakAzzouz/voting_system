import { DomainErrors } from "./DomainErrors";

export namespace UserErrors {
  export class NotFound extends DomainErrors {
    constructor() {
      super("USER_NOT_FOUND");
    }
  }

  export class AlreadyExist extends DomainErrors {
    constructor() {
      super("EMAIL_ALREADY_EXIST");
    }
  }

  export class InvalidPassword extends DomainErrors {
    constructor() {
      super("INVALID_PASSWORD");
    }
  }

  export class InvalidEmail extends DomainErrors {
    constructor() {
      super("INVALID_EMAIL");
    }
  }

  export class EmailNotFound extends DomainErrors {
    constructor() {
      super("EMAIL_NOT_FOUND");
    }
  }
}
