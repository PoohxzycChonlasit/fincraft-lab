import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { WorkspaceCanvasService } from './workspace-canvas.service';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';

@Module({
  imports: [DatabaseModule],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceCanvasService],
})
export class WorkspaceModule {}
