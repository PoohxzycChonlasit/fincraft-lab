import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { AccessTokenPayload } from '../auth/types/access-token-payload.type';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { SaveCanvasSnapshotDto } from './dto/save-canvas-snapshot.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import {
  ApiCreateWorkspaceOperation,
  ApiDeleteWorkspaceOperation,
  ApiGetCanvasOperation,
  ApiGetWorkspaceOperation,
  ApiGetWorkspacesOperation,
  ApiSaveCanvasOperation,
  ApiUpdateWorkspaceOperation,
} from './openapi/workspace-openapi.decorators';
import type { CanvasSnapshotResponse } from './types/canvas-snapshot-response.type';
import type {
  DeleteWorkspaceResponse,
  WorkspaceResponse,
} from './types/workspace-response.type';
import { WorkspaceCanvasService } from './workspace-canvas.service';
import { WorkspaceService } from './workspace.service';

@ApiTags('Workspaces')
@ApiBearerAuth('access-token')
@Controller('workspaces')
@UseGuards(AuthGuard, RolesGuard)
export class WorkspaceController {
  constructor(
    @Inject(WorkspaceService)
    private readonly workspaceService: WorkspaceService,
    @Inject(WorkspaceCanvasService)
    private readonly workspaceCanvasService: WorkspaceCanvasService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateWorkspaceOperation()
  async createWorkspace(
    @CurrentUser() user: AccessTokenPayload,
    @Body() dto: CreateWorkspaceDto,
  ): Promise<{ data: WorkspaceResponse }> {
    const result = await this.workspaceService.createWorkspace(user.sub, dto);
    return { data: result };
  }

  @Get()
  @ApiGetWorkspacesOperation()
  async getWorkspaces(
    @CurrentUser() user: AccessTokenPayload,
  ): Promise<{ data: WorkspaceResponse[] }> {
    const result = await this.workspaceService.getWorkspaces(user.sub);
    return { data: result };
  }

  @Get(':workspaceId/canvas')
  @ApiGetCanvasOperation()
  async getCanvasSnapshot(
    @CurrentUser() user: AccessTokenPayload,
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' }))
    workspaceId: string,
  ): Promise<{ data: CanvasSnapshotResponse }> {
    const result = await this.workspaceCanvasService.getSnapshot(
      user.sub,
      workspaceId,
    );
    return { data: result };
  }

  @Put(':workspaceId/canvas')
  @ApiSaveCanvasOperation()
  async saveCanvasSnapshot(
    @CurrentUser() user: AccessTokenPayload,
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' }))
    workspaceId: string,
    @Body() dto: SaveCanvasSnapshotDto,
  ): Promise<{ data: CanvasSnapshotResponse }> {
    const result = await this.workspaceCanvasService.saveSnapshot(
      user.sub,
      workspaceId,
      dto,
    );
    return { data: result };
  }

  @Get(':workspaceId')
  @ApiGetWorkspaceOperation()
  async getWorkspace(
    @CurrentUser() user: AccessTokenPayload,
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' }))
    workspaceId: string,
  ): Promise<{ data: WorkspaceResponse }> {
    const result = await this.workspaceService.getWorkspace(
      user.sub,
      workspaceId,
    );
    return { data: result };
  }

  @Patch(':workspaceId')
  @ApiUpdateWorkspaceOperation()
  async updateWorkspace(
    @CurrentUser() user: AccessTokenPayload,
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' }))
    workspaceId: string,
    @Body() dto: UpdateWorkspaceDto,
  ): Promise<{ data: WorkspaceResponse }> {
    const result = await this.workspaceService.updateWorkspace(
      user.sub,
      workspaceId,
      dto,
    );
    return { data: result };
  }

  @Delete(':workspaceId')
  @ApiDeleteWorkspaceOperation()
  async deleteWorkspace(
    @CurrentUser() user: AccessTokenPayload,
    @Param('workspaceId', new ParseUUIDPipe({ version: '4' }))
    workspaceId: string,
  ): Promise<{ data: DeleteWorkspaceResponse }> {
    const result = await this.workspaceService.deleteWorkspace(
      user.sub,
      workspaceId,
    );
    return { data: result };
  }
}
