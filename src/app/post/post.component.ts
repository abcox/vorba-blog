import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { config, debounceTime, distinctUntilChanged, from, map, Observable, of, Subject, switchMap, tap, firstValueFrom } from 'rxjs';
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

  editCardVisible = false;

  pageSizeOptions = [5,10,15];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private postService: PostService,
    private snackBar: MatSnackBar
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
          return of(this.submitSearch());
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

  openSnackBar(message: string, action: string | undefined, duration: number = 3000) {
    return this.snackBar.open(message, action, {
      duration
    });
  }

  submitSearch() {    
    return this.searchPosts22(); // todo: debounce with rxjs
  }

  searchPosts22() {
    const pageIndex = this.paginator.pageIndex;
    const pageSize = this.paginator.pageSize;
    return this.searchPosts2(pageIndex, pageSize);
  }

  searchPosts2(pageIndex: number, pageSize: number) {
    const id = this.id;
    console.log(`q: ${this.postSearchString}`);
    return from(this.blogService.searchPosts(
      id, this.postSearchString, pageSize, pageIndex
      )).subscribe((res: any) => {        
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
      this.createPost();
    } else {
      this.updatePost();
    }
  }

  reportSuccessAndRefresh(context: string) {
    this.openSnackBar(`${context} successful`, 'Ok').afterDismissed().subscribe(() => this.reload());
  }

  reportFailure(context: string, err: any = undefined) {
    console.error(err);
    this.openSnackBar(`${context} successful`, 'Ok');
  }

  async createPost() {
    const context = 'Create';
    try {
      console.warn(`post: ${JSON.stringify(this.editedPost)}`);
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
