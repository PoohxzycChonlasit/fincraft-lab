import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AccessTokenModule } from '../infrastructure/jwt/access-token.module';
import { WorkspaceController } from './controllers/workspace.controller';
import { WorkspaceCanvasService } from './services/workspace-canvas.service';
import { WorkspaceService } from './services/workspace.service';

@Module({
  imports: [DatabaseModule, AccessTokenModule],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceCanvasService],
  exports: [WorkspaceService, WorkspaceCanvasService],
})
export class WorkspaceModule {}
