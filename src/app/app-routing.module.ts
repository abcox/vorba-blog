import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogComponent } from './blog/blog.component';
import { PostComponent } from './post/post.component';
import { SchedulerComponent } from './scheduler/scheduler.component';

export const routes: Routes = [
  //{ path: '**', title: 'Home', redirectTo: '/' },
  { path: 'blogs', component: BlogComponent, title: 'Blogs' },
  { path: 'posts', component: PostComponent, title: 'Posts' },
  { path: 'blog/:id', component: PostComponent },
  { path: 'post/:id', component: PostComponent },
  { path: 'scheduler', component: SchedulerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
//export const routing = RouterModule.forRoot(routes);

