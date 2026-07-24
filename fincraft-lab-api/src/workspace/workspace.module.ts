import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AccessTokenModule } from '../infrastructure/jwt/access-token.module';
import { WorkspaceCanvasWriterService } from './workspace-canvas-writer.service';
import { WorkspaceCanvasService } from './workspace-canvas.service';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';

@Module({
  imports: [DatabaseModule, AccessTokenModule],
  controllers: [WorkspaceController],
  providers: [
    WorkspaceService,
    WorkspaceCanvasService,
    WorkspaceCanvasWriterService,
  ],
  exports: [
    WorkspaceService,
    WorkspaceCanvasService,
    WorkspaceCanvasWriterService,
  ],
})
export class WorkspaceModule {}
