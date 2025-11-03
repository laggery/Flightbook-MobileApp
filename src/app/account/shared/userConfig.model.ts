export class Link {
  url: string;
  label: string;
}

export class Preparation {
  shvLinkDisabled?: boolean;
  dabsLinkDisabled?: boolean;
  links?: Link[];
}

export class notifications {
  email?: {
    appointment?: boolean;
  };
}

export class UserConfig {
  preparation?: Preparation;
  notifications?: notifications;
}