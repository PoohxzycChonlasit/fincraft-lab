import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  SimulationDetailEnvelopeDto,
  SimulationRunEnvelopeDto,
  SimulationsEnvelopeDto,
} from '../dto/simulation-response.dto';

export function ApiListSimulationsOperation() {
  return applyDecorators(
    ApiOperation({
      summary: 'List available simulations',
      description:
        'Returns a list of all active supported simulation models available to the authenticated user.',
    }),
    ApiOkResponse({
      description: 'Active simulations listed successfully',
      type: SimulationsEnvelopeDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Missing or invalid Bearer access token',
    }),
  );
}

export function ApiGetSimulationDetailOperation() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get simulation details',
      description:
        'Returns comprehensive educational metadata, input definitions, formula explanation, assumptions, limitations, sources, and disclaimer for a specific simulation.',
    }),
    ApiParam({
      name: 'simulationId',
      type: String,
      format: 'uuid',
      description: 'Simulation UUID v4',
    }),
    ApiOkResponse({
      description: 'Simulation detail retrieved successfully',
      type: SimulationDetailEnvelopeDto,
    }),
    ApiBadRequestResponse({
      description: 'Malformed UUID v4 parameter',
    }),
    ApiUnauthorizedResponse({
      description: 'Missing or invalid Bearer access token',
    }),
    ApiNotFoundResponse({
      description: 'Simulation not found or inactive',
    }),
  );
}

export function ApiRunSimulationOperation() {
  return applyDecorators(
    ApiOperation({
      summary: 'Run a simulation',
      description:
        'Executes deterministic simulation calculations using user-supplied inputs and persists an immutable simulation run snapshot.',
    }),
    ApiParam({
      name: 'simulationId',
      type: String,
      format: 'uuid',
      description: 'Simulation UUID v4',
    }),
    ApiCreatedResponse({
      description:
        'Simulation run executed and snapshot persisted successfully',
      type: SimulationRunEnvelopeDto,
    }),
    ApiBadRequestResponse({
      description:
        'Validation failure, negative/zero inputs, > 2 decimal places, or extra properties',
    }),
    ApiUnauthorizedResponse({
      description: 'Missing or invalid Bearer access token',
    }),
    ApiNotFoundResponse({
      description: 'Simulation not found or inactive',
    }),
  );
}

export function ApiGetSimulationRunOperation() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get simulation run details',
      description:
        'Returns historical snapshot inputs, outputs, assumptions, limitations, and safety disclaimer for a specific simulation run belonging to the authenticated user.',
    }),
    ApiParam({
      name: 'runId',
      type: String,
      format: 'uuid',
      description: 'Simulation run UUID v4',
    }),
    ApiOkResponse({
      description: 'Simulation run retrieved successfully',
      type: SimulationRunEnvelopeDto,
    }),
    ApiBadRequestResponse({
      description: 'Malformed UUID v4 parameter',
    }),
    ApiUnauthorizedResponse({
      description: 'Missing or invalid Bearer access token',
    }),
    ApiNotFoundResponse({
      description: 'Simulation run not found or belongs to another user',
    }),
  );
}
