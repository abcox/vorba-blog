import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as signalR from '@microsoft/signalr';

@Injectable({ providedIn: 'root' })
export class MessageService {
    hubConnection!: signalR.HubConnection;
    serviceEndpointUrl!: string;

    constructor(
        private snackBar: MatSnackBar
        ) {
        // nothing
    }

    start = (serviceEndpointUrl: string) => {
        this.serviceEndpointUrl = serviceEndpointUrl;
        this.startConnection();
    }

    private buildConnection() {
        if (this.hubConnection) {
            console.log(`Hub connection already built`);
            return;
        }
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(this.serviceEndpointUrl, {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets
            })
            .withAutomaticReconnect()
            .build();
        console.log(`Hub connection built`);
    }

    private startConnection() {
        this.buildConnection();
        this.hubConnection.start().then(() => {
            console.log(`Hub connection started.`);
        })
        .catch(err => console.error(`Hub connection failed to start: `, err));
    }

    dispatch(requestMethodName: string, payload: any) {
        this.hubConnection.invoke(requestMethodName, payload).catch(err => console.error(err));
    }

    listen(responseMethodName: string) {
        this.hubConnection.on(responseMethodName, (response: string) => {
            console.log(`response: ${response}`);
            this.openSnackBar(response, undefined);
        });
    }

    openSnackBar(
      message: string, action: string | undefined,
      duration: number = 3000
      ) {
        return this.snackBar.open(message, action, {
          duration
        });
    }

}
