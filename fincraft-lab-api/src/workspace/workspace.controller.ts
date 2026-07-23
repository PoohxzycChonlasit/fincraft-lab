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
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AccessTokenPayload } from '../auth/types/access-token-payload.type';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import type {
  DeleteWorkspaceResponse,
  WorkspaceResponse,
} from './types/workspace-response.type';
import { WorkspaceService } from './workspace.service';

@Controller('workspaces')
export class WorkspaceController {
  constructor(
    @Inject(WorkspaceService)
    private readonly workspaceService: WorkspaceService,
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
