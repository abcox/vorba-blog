import { Component, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, from, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { Post, BlogService, PostService } from '../core/api/v1';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent {
  title = "Posts"
  $id: Observable<any>;
  id: any;
  $posts: Observable<unknown>; // Post
  posts!: Post[];
  dataSource = new MatTableDataSource<Post>;
  displayedColumns = ['title','content','edit','delete'];
  post$!: Post;
  editedPost = {} as Post;
  selectedPost!: Post;

  //@ViewChild(MatCard) editCard!: MatCard;
  editCardVisible = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private postService: PostService
  ) {
    console.log(`post component`);

    this.$id = this.route.paramMap.pipe(
      map(param => param.get('id')),
      //filter(id => id !== null)
    ) as Observable<any>;

    this.$posts = this.$id.pipe(
      //tap((id: any) => console.log(`id: ${id}`)),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(id => {
        if (!!id && id !== 'null') {
          this.id = id;
          console.log(`id: ${id}`);
          return from(this.blogService.getPosts(id)); //.then((resp: any) => (resp.data as unknown) as Post));
          //return of()
        } else {
          this.id = null;
          return of({
            name: '',
            email: '',
            phone: ''
          } as Post);
        }
      }
    ));
    this.$posts.subscribe(posts => {
      this.posts = posts as Array<Post>;
      this.dataSource = new MatTableDataSource<Post>(this.posts);
    });
  }

  selectPost(post: Post) {
    this.selectedPost = post;
    console.log(`selected post id: ${post.postId}`);
    this.editedPost = { ...post } as Post;
    this.editCardVisible = true;
  }

  clearSelectedPost() {
    this.post$ = {} as Post;
    this.editCardVisible = false;
  }
  
  save() {
    if (!(this.editedPost?.postId)) {
      //console.warn(`post id empty`);
      //return;
      console.warn(`post: ${JSON.stringify(this.editedPost)}`);
      this.postService.createPost(this.editedPost).subscribe(res => console.log(res));
    } else {
      console.log(`post id: ${this.editedPost.postId}`);
      this.postService.updatePost(this.editedPost.postId, this.editedPost).subscribe(res => console.log(res));
      this.editCardVisible = false;
      console.log(`id: ${this.id}`);
    }
    this.reload();
  }

  add() {
    this.editedPost.blogId = this.id;
    this.editCardVisible = true;
  }

  deletePost(id: number) {
    this.postService.deletePost(id).subscribe(res => {
      console.log(res)
      this.reload();
    });
  }
  
  reload() {
    this.router.navigate(['/blog', this.id]).then(() => {
      window.location.reload();
    });
  }
}
