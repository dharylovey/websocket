import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Server as WebSocketServer } from 'ws';
import { WsService } from './ws.service';
import { WsEventType } from './types/ws-event.types';

@Injectable()
export class WsGateway implements OnModuleInit {
  private readonly logger = new Logger(WsGateway.name);
  private wss: WebSocketServer | null = null;

  constructor(private readonly wsService: WsService) {}

  onModuleInit() {
    const port = parseInt(process.env.WS_PORT || '3001', 10);

    this.wss = new WebSocketServer({
      port,
      path: '/ws',
    });

    this.logger.log(`WebSocket server started on ws://localhost:${port}/ws`);

    this.wss.on('connection', (ws, request) => {
      const clientId = this.wsService.registerClient(ws);
      this.logger.log(`Client connected from ${request.socket.remoteAddress}`);

      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(clientId, message);
        } catch (error) {
          this.logger.error(`Failed to parse message from ${clientId}:`, error);
          this.wsService.sendToClient(clientId, {
            type: WsEventType.ERROR,
            timestamp: new Date().toISOString(),
            data: {
              message: 'Invalid message format',
              code: 'INVALID_FORMAT',
            },
          });
        }
      });

      ws.on('close', () => {
        this.wsService.unregisterClient(clientId);
        this.logger.log(`Client disconnected: ${clientId}`);
      });

      ws.on('error', (error) => {
        this.logger.error(`WebSocket error for client ${clientId}:`, error);
        this.wsService.unregisterClient(clientId);
      });
    });

    this.wss.on('error', (error) => {
      this.logger.error('WebSocket server error:', error);
    });
  }

  private handleMessage(clientId: string, message: unknown): void {
    this.logger.debug(`Message from ${clientId}:`, message);

    // Handle ping/pong for connection health checks
    if (message && typeof message === 'object' && 'type' in message) {
      const msg = message as { type: string };
      if (msg.type === 'ping') {
        this.wsService.sendToClient(clientId, {
          type: 'pong' as WsEventType,
          timestamp: new Date().toISOString(),
          data: {},
        });
      }
    }
  }

  async onModuleDestroy() {
    if (this.wss) {
      this.logger.log('Closing all WebSocket connections...');
      this.wsService.closeAll();
      this.wss.close();
    }
  }
}
