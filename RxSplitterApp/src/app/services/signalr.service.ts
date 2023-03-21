import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  hubUrl: string;
  connection: any;

  constructor() {
    // this.hubUrl = 'http://rxsplitterapi.live1.dev.radixweb.net/signalrdemohub';
    this.hubUrl=environment.hubUrl
  }

  public async initiateSignalrConnection(): Promise<void> {
    try {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(this.hubUrl)
        .withAutomaticReconnect()
        .build();

      await this.connection.start();
      console.log(`SignalR connection success! connectionId: ${this.connection.connectionId}`);
    }
    catch (error) {
      console.log(`SignalR connection error: ${error}`);
    }
  }
}
