import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
//import * as api from 'vorba-blog-api';
import { BlogService, Blog, Post } from '../core/api/v1';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  title = "Blogs";
  data!: any;
  blogs!: Blog[];
  dataSource = new MatTableDataSource<Blog>;
  displayedColumns = ['id','url','delete','edit'];
  blog = {} as Blog;

  //constructor(private apiGateway: api.BlogService) { }
  constructor(
    private router: Router,
    private blogService: BlogService
    ) {
        // nothing
      }
  
  ngOnInit() {
    this.blogService.getBlogList().subscribe((res: any) => {
      //console.log(`res: ${JSON.stringify(res)}`);
      this.blogs = res;
      this.dataSource = res;
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
