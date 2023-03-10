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
import { SchedulerComponent } from './scheduler/scheduler.component';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import * as fromPost from './post/store/post-component.reducers';
import { PostEffects } from './post/store/post-component.effects';

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
    PostComponent,
    SchedulerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    //routing,
    BrowserAnimationsModule,
    ApiModule.forRoot(apiConfigFactory),
    HttpClientModule,
    MaterialModule,
    FormsModule,
    //StoreModule.forRoot(fromPost.postsReducer),
    StoreModule.forRoot({}),
    StoreModule.forFeature(fromPost.featureKey, fromPost.postsReducer),
    EffectsModule.forRoot([PostEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
