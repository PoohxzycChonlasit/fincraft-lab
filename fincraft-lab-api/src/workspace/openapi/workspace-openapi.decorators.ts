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
  ApiPayloadTooLargeResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CanvasSnapshotEnvelopeDto } from '../dto/canvas-snapshot-response.dto';
import {
  DeleteWorkspaceEnvelopeDto,
  WorkspaceEnvelopeDto,
  WorkspacesEnvelopeDto,
} from '../dto/workspace-response.dto';

export function ApiCreateWorkspaceOperation() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new workspace',
      description: 'Creates a new ACTIVE workspace for the authenticated user.',
    }),
    ApiCreatedResponse({
      description: 'Workspace created successfully',
      type: WorkspaceEnvelopeDto,
    }),
    ApiBadRequestResponse({
      description: 'Workspace name is empty or exceeds 100 characters',
    }),
    ApiUnauthorizedResponse({
      description: 'Missing or invalid Bearer access token',
    }),
    ApiForbiddenResponse({ description: 'User account is disabled' }),
  );
}

export function ApiGetWorkspacesOperation() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all workspaces owned by current user',
      description:
        'Retrieves all workspaces owned by the authenticated user ordered by updatedAt DESC.',
    }),
    ApiOkResponse({
      description: 'Workspaces list retrieved successfully',
      type: WorkspacesEnvelopeDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Missing or invalid Bearer access token',
    }),
    ApiForbiddenResponse({ description: 'User account is disabled' }),
  );
}

export function ApiGetCanvasOperation() {
  return applyDecorators(
    ApiTags('Canvas'),
    ApiOperation({
      summary: 'Get canvas snapshot for a workspace',
      description:
        'Loads all persisted WorkspaceNode and WorkspaceEdge records for an owned ACTIVE or ARCHIVED workspace.',
    }),
    ApiParam({
      name: 'workspaceId',
      description: 'Workspace UUID v4',
      type: String,
    }),
    ApiOkResponse({
      description: 'Canvas graph snapshot loaded successfully',
      type: CanvasSnapshotEnvelopeDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Missing or invalid Bearer access token',
    }),
    ApiForbiddenResponse({ description: 'User account is disabled' }),
    ApiNotFoundResponse({
      description: 'Workspace not found or not owned by user',
    }),
  );
}

export function ApiSaveCanvasOperation() {
  return applyDecorators(
    ApiTags('Canvas'),
    ApiOperation({
      summary: 'Replace canvas graph snapshot atomically',
      description:
        'Atomically replaces the complete persisted Canvas graph snapshot for an owned ACTIVE workspace.',
    }),
    ApiParam({
      name: 'workspaceId',
      description: 'Workspace UUID v4',
      type: String,
    }),
    ApiOkResponse({
      description: 'Canvas graph snapshot replaced and committed successfully',
      type: CanvasSnapshotEnvelopeDto,
    }),
    ApiBadRequestResponse({
      description:
        'Validation failure (exceeds node/edge limits, invalid coordinates, duplicate IDs, dangling edge, inactive element, valueData > 4096 bytes, or domain payload > 512 KB)',
    }),
    ApiUnauthorizedResponse({
      description: 'Missing or invalid Bearer access token',
    }),
    ApiForbiddenResponse({
      description: 'User account disabled or element not unlocked by user',
    }),
    ApiNotFoundResponse({ description: 'Workspace or element not found' }),
    ApiConflictResponse({
      description: 'Workspace is ARCHIVED or canvas identifier conflict exists',
    }),
    ApiPayloadTooLargeResponse({
      description: 'HTTP payload exceeds framework 1 MB limit',
    }),
  );
}

export function ApiGetWorkspaceOperation() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get workspace details by ID',
      description:
        'Retrieves metadata for a specific workspace owned by the authenticated user.',
    }),
    ApiParam({
      name: 'workspaceId',
      description: 'Workspace UUID v4',
      type: String,
    }),
    ApiOkResponse({
      description: 'Workspace details retrieved successfully',
      type: WorkspaceEnvelopeDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Missing or invalid Bearer access token',
    }),
    ApiForbiddenResponse({ description: 'User account is disabled' }),
    ApiNotFoundResponse({
      description: 'Workspace not found or not owned by user',
    }),
  );
}

export function ApiUpdateWorkspaceOperation() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update workspace metadata',
      description:
        'Updates workspace name or status (ACTIVE/ARCHIVED) for an owned workspace.',
    }),
    ApiParam({
      name: 'workspaceId',
      description: 'Workspace UUID v4',
      type: String,
    }),
    ApiOkResponse({
      description: 'Workspace metadata updated successfully',
      type: WorkspaceEnvelopeDto,
    }),
    ApiBadRequestResponse({
      description: 'Empty update payload or invalid field values',
    }),
    ApiUnauthorizedResponse({
      description: 'Missing or invalid Bearer access token',
    }),
    ApiForbiddenResponse({ description: 'User account is disabled' }),
    ApiNotFoundResponse({
      description: 'Workspace not found or not owned by user',
    }),
  );
}

export function ApiDeleteWorkspaceOperation() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete a workspace',
      description:
        'Permanently deletes an owned workspace and all associated canvas nodes and edges.',
    }),
    ApiParam({
      name: 'workspaceId',
      description: 'Workspace UUID v4',
      type: String,
    }),
    ApiOkResponse({
      description: 'Workspace deleted successfully',
      type: DeleteWorkspaceEnvelopeDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Missing or invalid Bearer access token',
    }),
    ApiForbiddenResponse({ description: 'User account is disabled' }),
    ApiNotFoundResponse({
      description: 'Workspace not found or not owned by user',
    }),
  );
}
