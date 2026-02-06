import { Injectable, Logger } from '@nestjs/common';
import { WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { WsEvent, WsEventType } from './types/ws-event.types';

export interface WsClient {
  id: string;
  ws: WebSocket;
  connectedAt: Date;
}

@Injectable()
export class WsService {
  private readonly logger = new Logger(WsService.name);
  private clients = new Map<string, WsClient>();

  registerClient(ws: WebSocket): string {
    const clientId = uuidv4();
    const client: WsClient = {
      id: clientId,
      ws,
      connectedAt: new Date(),
    };

    this.clients.set(clientId, client);
    this.logger.log(
      `Client registered: ${clientId}. Total clients: ${this.clients.size}`,
    );

    // Send connection acknowledgment
    this.sendToClient(clientId, {
      type: WsEventType.CONNECTION_ACK,
      timestamp: new Date().toISOString(),
      data: {
        message: 'Connected to WebSocket server',
        clientId,
      },
    });

    return clientId;
  }

  unregisterClient(clientId: string): void {
    const removed = this.clients.delete(clientId);
    if (removed) {
      this.logger.log(
        `Client unregistered: ${clientId}. Total clients: ${this.clients.size}`,
      );
    }
  }

  broadcast<T>(event: WsEvent<T>): void {
    const message = JSON.stringify(event);
    let successCount = 0;
    let failureCount = 0;

    this.clients.forEach((client, clientId) => {
      try {
        if (client.ws.readyState === WebSocket.OPEN) {
          client.ws.send(message);
          successCount++;
        } else {
          // Clean up dead connections
          this.unregisterClient(clientId);
          failureCount++;
        }
      } catch (error) {
        this.logger.error(`Failed to send to client ${clientId}:`, error);
        this.unregisterClient(clientId);
        failureCount++;
      }
    });

    this.logger.debug(
      `Broadcast ${event.type}: ${successCount} succeeded, ${failureCount} failed`,
    );
  }

  sendToClient<T>(clientId: string, event: WsEvent<T>): void {
    const client = this.clients.get(clientId);
    if (!client) {
      this.logger.warn(`Client ${clientId} not found`);
      return;
    }

    try {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(event));
      } else {
        this.unregisterClient(clientId);
      }
    } catch (error) {
      this.logger.error(`Failed to send to client ${clientId}:`, error);
      this.unregisterClient(clientId);
    }
  }

  getClientCount(): number {
    return this.clients.size;
  }

  closeAll(): void {
    this.clients.forEach((client, clientId) => {
      try {
        client.ws.close();
      } catch (error) {
        this.logger.error(`Error closing client ${clientId}:`, error);
      }
    });
    this.clients.clear();
    this.logger.log('All WebSocket connections closed');
  }
}
