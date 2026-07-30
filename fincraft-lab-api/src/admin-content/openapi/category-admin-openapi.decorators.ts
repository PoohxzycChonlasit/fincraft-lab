import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  AdminCategoryDetailEnvelopeDto,
  AdminCategoryListEnvelopeDto,
} from '../dto/category-admin-response.dto';

export function ApiGetAdminCategories() {
  return applyDecorators(
    ApiOperation({
      summary: 'List element categories for administrative management',
      description:
        'Returns all element categories sorted by sort order and name.',
    }),
    ApiOkResponse({ type: AdminCategoryListEnvelopeDto }),
    ApiUnauthorizedResponse({
      description: 'Missing or invalid Bearer access token',
    }),
    ApiForbiddenResponse({
      description: 'Requires ADMIN or SUPER_ADMIN role',
    }),
  );
}

export function ApiGetAdminCategoryDetail() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get element category detail',
      description:
        'Returns detailed information for a specific element category.',
    }),
    ApiParam({ name: 'categoryId', type: String, format: 'uuid' }),
    ApiOkResponse({ type: AdminCategoryDetailEnvelopeDto }),
    ApiBadRequestResponse({ description: 'Malformed UUID v4 parameter' }),
    ApiUnauthorizedResponse({
      description: 'Missing or invalid Bearer access token',
    }),
    ApiForbiddenResponse({
      description: 'Requires ADMIN or SUPER_ADMIN role',
    }),
    ApiNotFoundResponse({ description: 'Element category not found' }),
  );
}

export function ApiCreateAdminCategory() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new element category',
      description: 'Creates a new element category with a unique name.',
    }),
    ApiCreatedResponse({ type: AdminCategoryDetailEnvelopeDto }),
    ApiBadRequestResponse({
      description: 'Validation failure or missing fields',
    }),
    ApiUnauthorizedResponse({
      description: 'Missing or invalid Bearer access token',
    }),
    ApiForbiddenResponse({
      description: 'Requires ADMIN or SUPER_ADMIN role',
    }),
    ApiConflictResponse({ description: 'Category name already exists' }),
  );
}

export function ApiUpdateAdminCategory() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update an existing element category',
      description: 'Updates editable fields of an element category.',
    }),
    ApiParam({ name: 'categoryId', type: String, format: 'uuid' }),
    ApiOkResponse({ type: AdminCategoryDetailEnvelopeDto }),
    ApiBadRequestResponse({
      description: 'Validation failure or no editable fields',
    }),
    ApiUnauthorizedResponse({
      description: 'Missing or invalid Bearer access token',
    }),
    ApiForbiddenResponse({
      description: 'Requires ADMIN or SUPER_ADMIN role',
    }),
    ApiNotFoundResponse({ description: 'Element category not found' }),
    ApiConflictResponse({ description: 'Category name already exists' }),
  );
}

export function ApiDeleteAdminCategory() {
  return applyDecorators(
    ApiOperation({
      summary: 'Archive an element category',
      description:
        'Soft-deletes an element category by setting its status to INACTIVE.',
    }),
    ApiParam({ name: 'categoryId', type: String, format: 'uuid' }),
    ApiOkResponse({ type: AdminCategoryDetailEnvelopeDto }),
    ApiBadRequestResponse({ description: 'Malformed UUID v4 parameter' }),
    ApiUnauthorizedResponse({
      description: 'Missing or invalid Bearer access token',
    }),
    ApiForbiddenResponse({
      description: 'Requires ADMIN or SUPER_ADMIN role',
    }),
    ApiNotFoundResponse({ description: 'Element category not found' }),
  );
}
