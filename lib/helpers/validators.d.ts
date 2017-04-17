declare module "profanity-util" {
  export function check(target_string: string, forbidden_list?: string[]): string[];
}
