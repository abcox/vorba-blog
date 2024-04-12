import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
//import * as api from 'vorba-blog-api';
import { BlogService, Blog, Post, BlogSearchRequest } from '../core/api/v1';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit, AfterViewInit {

  title = "Blogs";
  data!: any;
  blogs!: Blog[];
  dataSource = new MatTableDataSource<Blog>;
  displayedColumns = ['id','url','delete','edit'];
  blog = {} as Blog;

  pageSizeOptions = [5, 10, 20];
  totalItems = 0;
  blogSearchUrl = '';
  pageIndex = 1;
  pageSize = 5;
  blogUrlSearchString = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //constructor(private apiGateway: api.BlogService) { }
  constructor(
    private router: Router,
    private blogService: BlogService
    ) {
        // nothing
      }

  ngOnInit() {
    //this.getBlogList();
    //this.searchBlogs();
    this.dataSource.paginator = this.paginator;
    this.paginator?.page.subscribe(page => {
      console.log(`page: `, page);
      this.searchBlogs2(page.pageIndex, page.pageSize);
    });
    this.searchBlogs2(0, 5);
  }

  ngAfterViewInit() {
    // nothing
  }

  clearSearch() {
    this.blogUrlSearchString='';
  }

  searchBlogs(pageIndex: number, pageSize: number) {
    this.blogService.searchBlogs(
      this.blogSearchUrl,
      pageSize,
      pageIndex
      ).subscribe((res: any) => {
        console.log(`res: ${JSON.stringify(res)}`);
        this.blogs = res;
        this.dataSource = res.data;
        console.log(`dataSource: ${JSON.stringify(this.dataSource)}`);
        this.totalItems = res.length;
        this.paginator.length = res.totalItems;
      });
  }

  _selectedViewOption = '1';
  get selectedViewOption() {
    return this._selectedViewOption;
  }
  set selectedViewOption(value) {
    this._selectedViewOption = value;
  }
  _viewOptions = [
      { key: '1', value: 'Option 1'},
      { key: '2', value: 'Option 2'},
      { key: '3', value: 'Option 3'},
    ];
  get viewOptions() {
    return [
      { key: '1', value: 'Option 1'},
      { key: '2', value: 'Option 2'},
      { key: '3', value: 'Option 3'},
    ];
  }

  searchBlogs22() {
    const pageIndex = this.paginator.pageIndex;
    const pageSize = this.paginator.pageSize;
    this.searchBlogs2(pageIndex, pageSize);
  }

  searchBlogs2(pageIndex: number, pageSize: number) {
    const pageNumber = pageIndex ?? this.paginator.pageIndex;
    pageSize = pageSize ?? this.paginator.pageSize;
    const req = { q: this.blogUrlSearchString, pageNumber, pageSize } as BlogSearchRequest;
    console.log(`req: ${JSON.stringify(req)}`);
    this.blogService.searchBlogs2(req).subscribe((res: any) => {
        console.log(`res: ${JSON.stringify(res)}`);
        this.blogs = res.data;
        this.dataSource = res.data;
        console.log(`dataSource: ${JSON.stringify(this.dataSource)}`);
        this.totalItems = res.length;
        this.paginator.length = res.totalItems;
      });
  }

  getBlogList() {
    this.blogService.getBlogList().subscribe((res: any) => {
      //console.log(`res: ${JSON.stringify(res)}`);
      this.blogs = res;
      this.dataSource = res;
      console.log(`dataSource: ${JSON.stringify(this.dataSource)}`);
      this.totalItems = res.length;
    });
  }

  create() {
    this.blog.blogId = undefined;
    this.blogService.createBlog(this.blog).subscribe(res => console.log(res));
    window.location.reload();
  }

  update() {
    if (!this.blog.blogId) return;
    this.blogService.updateBlog(this.blog.blogId, this.blog).subscribe(res => console.log(res));
    window.location.reload();
  }

  deleteBlog(id: number) {
    this.blogService.deleteBlog(id).subscribe(res => console.log(res));
    this.reload();
  }

  reload() {
    this.router.navigate(['/blogs']).then(() => {
      window.location.reload();
    });
  }

  selectBlogForEdit(blog: Blog) {
    this.blog = blog;
  }
}
