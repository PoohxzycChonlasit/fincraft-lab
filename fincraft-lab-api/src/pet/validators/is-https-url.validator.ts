import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

/**
 * Validates that a string is a syntactically valid absolute HTTPS URL (max 2048 chars).
 * Rejects http:, data:, file:, javascript:, and whitespace-only strings.
 */
export function IsHttpsUrl(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      name: 'isHttpsUrl',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          if (value === undefined || value === null) {
            return true;
          }

          if (typeof value !== 'string') {
            return false;
          }

          const trimmed = value.trim();
          if (trimmed.length === 0 || trimmed.length > 2048) {
            return false;
          }

          try {
            const parsed = new URL(trimmed);
            return parsed.protocol === 'https:';
          } catch {
            return false;
          }
        },
        defaultMessage(args: ValidationArguments): string {
          return `${args.property} must be a syntactically valid absolute HTTPS URL (max 2048 characters)`;
        },
      },
    });
  };
}
