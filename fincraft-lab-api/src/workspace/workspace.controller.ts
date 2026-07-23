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
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AccessTokenPayload } from '../auth/types/access-token-payload.type';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { SaveCanvasSnapshotDto } from './dto/save-canvas-snapshot.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import type { CanvasSnapshotResponse } from './types/canvas-snapshot-response.type';
import type {
  DeleteWorkspaceResponse,
  WorkspaceResponse,
} from './types/workspace-response.type';
import { WorkspaceCanvasService } from './workspace-canvas.service';
import { WorkspaceService } from './workspace.service';

@Controller('workspaces')
export class WorkspaceController {
  constructor(
    @Inject(WorkspaceService)
    private readonly workspaceService: WorkspaceService,
    @Inject(WorkspaceCanvasService)
    private readonly workspaceCanvasService: WorkspaceCanvasService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createWorkspace(
    @CurrentUser() user: AccessTokenPayload,
    @Body() dto: CreateWorkspaceDto,
  ): Promise<{ data: WorkspaceResponse }> {
    const result = await this.workspaceService.createWorkspace(user.sub, dto);
    return { data: result };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getWorkspaces(
    @CurrentUser() user: AccessTokenPayload,
  ): Promise<{ data: WorkspaceResponse[] }> {
    const result = await this.workspaceService.getWorkspaces(user.sub);
    return { data: result };
  }

  @Get(':workspaceId/canvas')
  @HttpCode(HttpStatus.OK)
  async getCanvasSnapshot(
    @CurrentUser() user: AccessTokenPayload,
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
  ): Promise<{ data: CanvasSnapshotResponse }> {
    const result = await this.workspaceCanvasService.getSnapshot(
      user.sub,
      workspaceId,
    );
    return { data: result };
  }

  @Put(':workspaceId/canvas')
  @HttpCode(HttpStatus.OK)
  async saveCanvasSnapshot(
    @CurrentUser() user: AccessTokenPayload,
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
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
  @HttpCode(HttpStatus.OK)
  async getWorkspace(
    @CurrentUser() user: AccessTokenPayload,
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
  ): Promise<{ data: WorkspaceResponse }> {
    const result = await this.workspaceService.getWorkspace(
      user.sub,
      workspaceId,
    );
    return { data: result };
  }

  @Patch(':workspaceId')
  @HttpCode(HttpStatus.OK)
  async updateWorkspace(
    @CurrentUser() user: AccessTokenPayload,
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
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
  @HttpCode(HttpStatus.OK)
  async deleteWorkspace(
    @CurrentUser() user: AccessTokenPayload,
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
  ): Promise<{ data: DeleteWorkspaceResponse }> {
    const result = await this.workspaceService.deleteWorkspace(
      user.sub,
      workspaceId,
    );
    return { data: result };
  }
}
