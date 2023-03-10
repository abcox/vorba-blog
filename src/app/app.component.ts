import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { routes } from './app-routing.module';
import { MessageService } from './services/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'vorba-blog';
  routes = routes;
  mobileQuery!: MediaQueryList;
  private _mobileQueryListener: () => void;
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public messageService: MessageService
    ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    console.log(`routes: ${JSON.stringify(routes)}`);
  }

  ngOnInit() {    
    this.messageService.start('https://localhost:7243/messages');

    setTimeout(() => {
      this.messageService.dispatch(`task1`, { data: `hey` });
      this.messageService.listen(`task1_Response`);
    }, 2000);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    
    this.messageService.hubConnection.off(`askServerResponse`);
  }
}
