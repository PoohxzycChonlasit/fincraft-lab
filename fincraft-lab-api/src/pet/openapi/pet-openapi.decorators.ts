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
import { PetEnvelopeDto } from '../dto/pet-response.dto';

export function ApiGetMyPet() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get my Pet profile',
      description:
        'Retrieve the authenticated user’s personal Pet guide profile.',
    }),
    ApiOkResponse({
      description: 'Pet profile retrieved successfully',
      type: PetEnvelopeDto,
    }),
    ApiUnauthorizedResponse({
      description:
        'Missing/invalid authentication token or user account not found',
    }),
    ApiForbiddenResponse({
      description: 'User account is disabled (INACTIVE or BANNED)',
    }),
    ApiNotFoundResponse({
      description: 'Pet profile not found',
    }),
  );
}

export function ApiCreatePet() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create my Pet profile',
      description:
        'Create the authenticated user’s first personal Pet guide profile.',
    }),
    ApiCreatedResponse({
      description: 'Pet profile created successfully',
      type: PetEnvelopeDto,
    }),
    ApiBadRequestResponse({
      description: 'Validation failed or invalid body properties',
    }),
    ApiUnauthorizedResponse({
      description:
        'Missing/invalid authentication token or user account not found',
    }),
    ApiForbiddenResponse({
      description: 'User account is disabled (INACTIVE or BANNED)',
    }),
    ApiConflictResponse({
      description: 'Pet profile already exists',
    }),
  );
}

export function ApiUpdatePet() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update my Pet profile',
      description:
        'Update editable fields of the authenticated user’s Pet guide profile.',
    }),
    ApiOkResponse({
      description: 'Pet profile updated successfully',
      type: PetEnvelopeDto,
    }),
    ApiBadRequestResponse({
      description:
        'Validation failed, non-HTTPS avatar URL, or empty request body',
    }),
    ApiUnauthorizedResponse({
      description:
        'Missing/invalid authentication token or user account not found',
    }),
    ApiForbiddenResponse({
      description: 'User account is disabled (INACTIVE or BANNED)',
    }),
    ApiNotFoundResponse({
      description: 'Pet profile not found',
    }),
  );
}
