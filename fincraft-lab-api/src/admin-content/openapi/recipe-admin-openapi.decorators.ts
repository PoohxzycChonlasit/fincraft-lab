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
  AdminRecipeDetailEnvelopeDto,
  AdminRecipeListEnvelopeDto,
} from '../dto/recipe-admin-response.dto';

export function ApiGetAdminRecipes() {
  return applyDecorators(
    ApiOperation({
      summary: 'List craft recipes for administrative management',
      description:
        'Returns all craft recipes with input and output element details.',
    }),
    ApiOkResponse({ type: AdminRecipeListEnvelopeDto }),
    ApiUnauthorizedResponse({
      description: 'Missing or invalid Bearer access token',
    }),
    ApiForbiddenResponse({
      description: 'Requires ADMIN or SUPER_ADMIN role',
    }),
  );
}

export function ApiGetAdminRecipeDetail() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get craft recipe detail',
      description: 'Returns detailed information for a specific craft recipe.',
    }),
    ApiParam({ name: 'recipeId', type: String, format: 'uuid' }),
    ApiOkResponse({ type: AdminRecipeDetailEnvelopeDto }),
    ApiBadRequestResponse({ description: 'Malformed UUID v4 parameter' }),
    ApiUnauthorizedResponse({
      description: 'Missing or invalid Bearer access token',
    }),
    ApiForbiddenResponse({
      description: 'Requires ADMIN or SUPER_ADMIN role',
    }),
    ApiNotFoundResponse({ description: 'Craft recipe not found' }),
  );
}

export function ApiCreateAdminRecipe() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new craft recipe',
      description:
        'Creates a new craft recipe with exactly two distinct input elements.',
    }),
    ApiCreatedResponse({ type: AdminRecipeDetailEnvelopeDto }),
    ApiBadRequestResponse({
      description: 'Validation failure or invalid element IDs',
    }),
    ApiUnauthorizedResponse({
      description: 'Missing or invalid Bearer access token',
    }),
    ApiForbiddenResponse({
      description: 'Requires ADMIN or SUPER_ADMIN role',
    }),
    ApiConflictResponse({
      description: 'Equivalent craft recipe already exists',
    }),
  );
}

export function ApiUpdateAdminRecipe() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update an existing craft recipe',
      description:
        'Updates metadata, output element, or replaces input elements atomically.',
    }),
    ApiParam({ name: 'recipeId', type: String, format: 'uuid' }),
    ApiOkResponse({ type: AdminRecipeDetailEnvelopeDto }),
    ApiBadRequestResponse({
      description: 'Validation failure or no editable fields',
    }),
    ApiUnauthorizedResponse({
      description: 'Missing or invalid Bearer access token',
    }),
    ApiForbiddenResponse({
      description: 'Requires ADMIN or SUPER_ADMIN role',
    }),
    ApiNotFoundResponse({ description: 'Craft recipe not found' }),
    ApiConflictResponse({
      description: 'Equivalent craft recipe already exists',
    }),
  );
}

export function ApiDeleteAdminRecipe() {
  return applyDecorators(
    ApiOperation({
      summary: 'Archive a craft recipe',
      description:
        'Soft-deletes a craft recipe by setting its status to INACTIVE.',
    }),
    ApiParam({ name: 'recipeId', type: String, format: 'uuid' }),
    ApiOkResponse({ type: AdminRecipeDetailEnvelopeDto }),
    ApiBadRequestResponse({ description: 'Malformed UUID v4 parameter' }),
    ApiUnauthorizedResponse({
      description: 'Missing or invalid Bearer access token',
    }),
    ApiForbiddenResponse({
      description: 'Requires ADMIN or SUPER_ADMIN role',
    }),
    ApiNotFoundResponse({ description: 'Craft recipe not found' }),
  );
}
