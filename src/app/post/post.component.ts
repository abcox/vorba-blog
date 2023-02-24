import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, from, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { Post, BlogService, PostService } from '../core/api/v1';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements AfterViewInit {
  title = "Posts"
  $id!: Observable<any>;
  id: any;
  $posts!: Observable<unknown>; // Post
  posts!: Post[];
  dataSource = new MatTableDataSource<Post>;
  displayedColumns = ['title','content','copy','edit','delete'];
  post$!: Post;
  editedPost = {} as Post;
  selectedPost!: Post;
  postSearchString = '';

  //@ViewChild(MatCard) editCard!: MatCard;
  editCardVisible = false;

  pageSizeOptions = [5,10,15];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private postService: PostService
  ) {
    // nothing
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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
          return from(this.getPosts(id)); //.then((resp: any) => (resp.data as unknown) as Post));
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
    
    this.paginator.page.subscribe(page => {
      console.log(`page: `, page);
      this.searchPosts2(page.pageIndex, page.pageSize);
    });
  }

  submitSearch() {    
    this.searchPosts22(); // todo: debounce with rxjs
  }

  searchPosts22() {
    const pageIndex = this.paginator.pageIndex;
    const pageSize = this.paginator.pageSize;
    this.searchPosts2(pageIndex, pageSize);
  }

  searchPosts2(pageIndex: number, pageSize: number) {
    const id = this.id;
    console.log(`q: ${this.postSearchString}`);
    return this.blogService.searchPosts(
      id, this.postSearchString, pageSize, pageIndex
      ).subscribe((res: any) => {        
        console.log(`res: ${JSON.stringify(res)}`);
        this.dataSource = res.data;
        console.log(`dataSource: ${JSON.stringify(this.dataSource)}`);
        //this.totalItems = res.length;
        this.paginator.length = res.totalItems;
      }); // todo: add searchPosts
  }

  clearSearch() {
    this.postSearchString='';
    this.searchPosts22();
  }

  getPosts(id: number) {
    id = id ?? this.id;
    return this.blogService.getPosts(id);
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

  copyPost(post: Post) {
    if (!post) {
      console.error(`post empty`);
      return;
    }
    post.postId = undefined;
    this.postService.createPost(post).subscribe(res => console.log(res));
    window.location.reload();
  }
}
