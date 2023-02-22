import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogComponent } from './blog/blog.component';
import { PostComponent } from './post/post.component';

export const routes: Routes = [
  { path: 'blogs', component: BlogComponent },
  { path: 'blog/:id', component: PostComponent },
  { path: 'post/:id', component: PostComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
//export const routing = RouterModule.forRoot(routes);

