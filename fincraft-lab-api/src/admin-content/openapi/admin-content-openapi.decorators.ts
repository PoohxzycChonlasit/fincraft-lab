import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  AdminElementDetailEnvelopeDto,
  AdminElementListEnvelopeDto,
} from '../dto/element-admin-response.dto';

export function ApiGetAdminElements() {
  return applyDecorators(
    ApiOperation({
      summary: 'List all Elements for Admin',
      description:
        'Retrieve full catalogue of Element master records (ADMIN and SUPER_ADMIN only). Includes all content statuses.',
    }),
    ApiOkResponse({
      description: 'Element list retrieved successfully',
      type: AdminElementListEnvelopeDto,
    }),
    ApiUnauthorizedResponse({
      description:
        'Missing/invalid authentication token or user account not found',
    }),
    ApiForbiddenResponse({
      description:
        'User account is disabled or user does not have ADMIN or SUPER_ADMIN role',
    }),
  );
}

export function ApiGetAdminElementDetail() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get single Element admin detail',
      description:
        'Retrieve single Element master record with category and DiscoveryDetail (ADMIN and SUPER_ADMIN only).',
    }),
    ApiOkResponse({
      description: 'Element detail retrieved successfully',
      type: AdminElementDetailEnvelopeDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid UUID v4 elementId format',
    }),
    ApiUnauthorizedResponse({
      description:
        'Missing/invalid authentication token or user account not found',
    }),
    ApiForbiddenResponse({
      description:
        'User account is disabled or user does not have ADMIN or SUPER_ADMIN role',
    }),
    ApiNotFoundResponse({
      description: 'Element not found',
    }),
  );
}

export function ApiCreateAdminElement() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create Element master record',
      description:
        'Create a new Element master record (ADMIN and SUPER_ADMIN only). Slug is immutable after create.',
    }),
    ApiCreatedResponse({
      description: 'Element created successfully',
      type: AdminElementDetailEnvelopeDto,
    }),
    ApiBadRequestResponse({
      description: 'Validation failed, invalid enum, or malformed payload',
    }),
    ApiUnauthorizedResponse({
      description:
        'Missing/invalid authentication token or user account not found',
    }),
    ApiForbiddenResponse({
      description:
        'User account is disabled or user does not have ADMIN or SUPER_ADMIN role',
    }),
    ApiNotFoundResponse({
      description: 'Element category not found',
    }),
    ApiConflictResponse({
      description: 'Element slug already exists',
    }),
  );
}

export function ApiUpdateAdminElement() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update editable Element fields',
      description:
        'Update editable Element fields and activation status (ADMIN and SUPER_ADMIN only). Immutable fields (slug, elementType, isStarter) are rejected.',
    }),
    ApiOkResponse({
      description: 'Element updated successfully',
      type: AdminElementDetailEnvelopeDto,
    }),
    ApiBadRequestResponse({
      description:
        'Validation failed, empty body {}, or attempted immutable field modification',
    }),
    ApiUnauthorizedResponse({
      description:
        'Missing/invalid authentication token or user account not found',
    }),
    ApiForbiddenResponse({
      description:
        'User account is disabled or user does not have ADMIN or SUPER_ADMIN role',
    }),
    ApiNotFoundResponse({
      description: 'Element or Element category not found',
    }),
  );
}

export function ApiDeleteAdminElement() {
  return applyDecorators(
    ApiOperation({
      summary: 'Archive Element master record',
      description:
        'Soft delete/archive an Element master record by setting its status to INACTIVE (ADMIN and SUPER_ADMIN only). Idempotent.',
    }),
    ApiOkResponse({
      description: 'Element archived successfully',
      type: AdminElementDetailEnvelopeDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid UUID v4 elementId format',
    }),
    ApiUnauthorizedResponse({
      description:
        'Missing/invalid authentication token or user account not found',
    }),
    ApiForbiddenResponse({
      description:
        'User account is disabled or user does not have ADMIN or SUPER_ADMIN role',
    }),
    ApiNotFoundResponse({
      description: 'Element not found',
    }),
  );
}

export function ApiUpsertDiscoveryDetail() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create or replace DiscoveryDetail',
      description:
        'Idempotently create or replace the 1-to-1 DiscoveryDetail educational content for an Element (ADMIN and SUPER_ADMIN only).',
    }),
    ApiOkResponse({
      description: 'DiscoveryDetail created or replaced successfully',
      type: AdminElementDetailEnvelopeDto,
    }),
    ApiBadRequestResponse({
      description:
        'Validation failed, missing required fields, or invalid HTTPS source URL',
    }),
    ApiUnauthorizedResponse({
      description:
        'Missing/invalid authentication token or user account not found',
    }),
    ApiForbiddenResponse({
      description:
        'User account is disabled or user does not have ADMIN or SUPER_ADMIN role',
    }),
    ApiNotFoundResponse({
      description: 'Element not found',
    }),
  );
}
