import { Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../material.module';

//import { ApiModule, Configuration, ConfigurationParameters } from 'vorba-blog-api';
import { ApiModule, Configuration, ConfigurationParameters } from './core/api/v1'
import { HttpClientModule } from '@angular/common/http';
import { BlogComponent } from './blog/blog.component';
import { PostComponent } from './post/post.component';
import { FormsModule } from '@angular/forms';

//import { routing } from './app-routing.module';

export function apiConfigFactory (): Configuration {
  const params: ConfigurationParameters = {
    basePath: "http://localhost:7193/api",
  }
  return new Configuration(params);
}

@NgModule({
  declarations: [
    AppComponent,
    BlogComponent,
    PostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    //routing,
    BrowserAnimationsModule,
    ApiModule.forRoot(apiConfigFactory),
    HttpClientModule,
    MaterialModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
