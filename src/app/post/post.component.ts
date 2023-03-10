import { AfterContentInit, AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { config, debounceTime, distinctUntilChanged, from, map, Observable, of, Subject, switchMap, tap, firstValueFrom, Subscription, startWith, delay } from 'rxjs';
import { Post, BlogService, PostService as postService, PostsSearchRequest } from '../core/api/v1';
import * as PostsPageActions from './store/post-component.actions';
import { Store } from '@ngrx/store';
import { PostService } from './post.service';
import { pagination, posts } from './store/post-component.selectors'

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  title = "Posts"
  id$!: Subscription;
  id: any;
  posts!: Post[];
  dataSource = new MatTableDataSource<Post>;
  displayedColumns!: string[];
  posts$!: Subscription;
  editedPost = {} as Post;
  selectedPost!: Post;
  postSearchString = '';

  editCardVisible = false;

  pageSizeOptions = [5,10,15];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pagination$!: Subscription;
  paginator$!: Subscription;

  //posts$!: Observable<Post[] | undefined>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private postService: postService,
    private snackBar: MatSnackBar,
    private store: Store,
    private postService2: PostService
  ) {
    // nothing
  }

  ngOnDestroy(): void {
    //throw new Error('Method not implemented.');
    this.id$.unsubscribe();
    this.posts$.unsubscribe();
    this.pagination$.unsubscribe();
  }

  test() {
    //this.store.dispatch(PostsPageActions.opened());   // connect dispatch
    const request = {blogId: 3, q: '', pageNumber: 0, pageSize: 5} as PostsSearchRequest
    this.store.dispatch(PostsPageActions.searchPosts({request}));   // connect dispatch
  }

  ngOnInit(): void {
    // nothing
  }

  ngAfterContentInit(): void {
    // nothing
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    //console.log(`post component`);

    this.id$ = this.route.paramMap.pipe(      
      delay(0),
      map(paramMap => {
        this.id = paramMap.get('id')
        this.displayedColumns = !this.id ?
          ['blogId','title','content','copy','edit','delete'] :
          ['title','content','copy','edit','delete'];
        this.search();
      }),
    ).subscribe();

    //this.$posts.subscribe(posts => {
    //  //this.posts = posts as Array<Post>;
    //  this.dataSource = new MatTableDataSource<Post>(posts as Array<Post>);
    //});

    //this.posts$.subscribe(posts => {
    //  //this.posts = posts as Array<Post>;
    //  this.dataSource = new MatTableDataSource<Post>(posts as Array<Post>);
    //});
    
    this.paginator$ = this.paginator.page.pipe(
      startWith(null),
      map((pageEvent: PageEvent | null) => {
        //this.searchPosts3(page.pageIndex, page.pageSize);
        //this.store.dispatch(PostsPageActions.searchPosts({
        //  request: {
        //    blogId: this.id,
        //    q: this.postSearchString,
        //    pageNumber: pageEvent?.pageIndex ?? 0,
        //    pageSize: pageEvent?.pageSize ?? 5
        //  }
        //}));   // connect dispatch
        if (pageEvent) {
          console.log(`page: `, pageEvent);
          this.search();
        }
      })
    ).subscribe();
    
    //const request: PostsSearchRequest = { blogId: this.id, q: this.postSearchString, pageNumber: this.paginator.pageIndex, pageSize: this.paginator.pageSize };
    //this.store.dispatch(PostsPageActions.searchPosts({request}));   // connect dispatch
    //this.store.dispatch(PostsPageActions.searchPosts({request: { blogId: this.id, q: this.postSearchString, pageNumber: this.paginator.pageIndex, pageSize: this.paginator.pageSize }}));   // connect dispatch
    
    this.pagination$ = this.store.select(pagination).pipe(
      // prevent error: 'ExpressionChangedAfterItHasBeenCheckedError'
      // Ref: https://blog.angular-university.io/angular-debugging/
      delay(0),
      map(pagination => {
        if (this.paginator) {
          let pageNumber = pagination?.pageNumber ?? 0;
          pageNumber--;
          this.paginator.pageIndex = pageNumber;
          this.paginator.length = pagination.totalItems;
        }
      })
    ).subscribe();
    
    this.posts$ = this.store.select(posts).pipe(
      map((posts: Post[] | undefined) =>
        this.dataSource = new MatTableDataSource<Post>(posts))
    ).subscribe();
  }

  search2() {
    const id = this.id;
    const pageIndex = this.paginator.pageIndex;
    const pageSize = this.paginator.pageSize;
    return from(this.postService2.search(
      id, this.postSearchString, pageIndex, pageSize
      )).subscribe((res: any) => {        
        this.dataSource = res.data;
        //this.totalItems = res.length;
        this.paginator.length = res.totalItems;
      });
  }

  search() {
    this.store.dispatch(PostsPageActions.searchPosts({
      request: {
        blogId: this.id,
        q: this.postSearchString,
        pageNumber: this.paginator.pageIndex,
        pageSize: this.paginator.pageSize
      }
    }));
  }

  openSnackBar(
    message: string, action: string | undefined,
    duration: number = 3000
    ) {
      return this.snackBar.open(message, action, {
        duration
      });
  }

  clearSearch() {
    this.postSearchString='';
    //this.searchPosts22();
    return this.search();
  }

  selectPost(post: Post) {
    this.selectedPost = post;
    console.log(`selected post id: ${post.postId}`);
    this.editedPost = { ...post } as Post;
    this.editCardVisible = true;
  }

  clearSelectedPost() {
    //this.post$ = {} as Post;
    this.editCardVisible = false;
  }
  
  save() {
    if (!(this.editedPost?.postId)) {
      this.createPost();
    } else {
      this.updatePost();
    }
  }

  reportSuccessAndRefresh(context: string) {
    this.openSnackBar(`${context} successful`, 'Ok')
      .afterDismissed()
      .subscribe(() => this.reload());
  }

  reportFailure(context: string, err: any = undefined) {
    console.error(err);
    this.openSnackBar(`${context} successful`, 'Ok');
  }

  async createPost() {
    const context = 'Create';
    try {
      console.log(`post: ${JSON.stringify(this.editedPost)}`);
      const res = await firstValueFrom(this.postService.createPost(this.editedPost));
      this.editCardVisible = false;
      this.reportSuccessAndRefresh(context);
    } catch (err) {
      this.reportFailure(context, err);
    }
  }

  async updatePost() {
    const context = 'Update';
    if (!(this.editedPost?.postId)) {
      console.error(`postId undefined`);
      return;
    }
    try {
      //console.log(`post id: ${this.editedPost.postId}`);
      const res = await firstValueFrom(this.postService.updatePost(this.editedPost.postId, this.editedPost));
      this.editCardVisible = false;
      this.reportSuccessAndRefresh(context);
      console.log(`id: ${this.id}`);
    } catch (err) {
      this.reportFailure(context, err);
    }
  }

  add() {
    this.editedPost.blogId = this.id;
    this.editCardVisible = true;
  }

  async deletePost(id: number) {
    const context = 'Delete';
    try {
      await firstValueFrom(this.postService.deletePost(id));
      this.reportSuccessAndRefresh(context);
    } catch (err) {
      console.error(err);
      this.reportFailure(context, err);
    }
  }
  
  reload() {
    return this.router.navigate(['/blog', this.id]).then(() => {
      window.location.reload();
    });
  }

  async copyPost(post: Post) {
    const context = 'Copy';
    if (!post) {
      this.reportFailure(`${context}: post empty`);
      return;
    }
    post.postId = undefined;
    try {
      const res = await firstValueFrom(this.postService.createPost(post));
      //console.log(`copyPost res: ${JSON.stringify(res)}`);
      this.reportSuccessAndRefresh(context);
    } catch (err) {
      this.reportFailure(context, err);
    }
  }
}
