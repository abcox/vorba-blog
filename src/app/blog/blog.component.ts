import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
//import * as api from 'vorba-blog-api';
import { BlogService, PostService, Blog, Post } from '../core/api/v1';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  title = "Blogs";
  data!: any;
  blogs!: Blog[];
  posts!: Post[];
  dataSource = new MatTableDataSource<Blog>;
  displayedColumns = ['id','url','delete'];
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

  async getBlogs() {
    try {
      const res: any = await this.blogService.getBlogList();
      console.log(`res: ${JSON.stringify(res)}`);
      //this.blogs = res.data;
    } catch (err) {
      console.error(err);
    }
  }

  getPosts(blogId: number | undefined) {
    try {
      if (blogId === undefined) return;
      this.blogService.getPosts(blogId).subscribe((res: any) => {
        console.log(`res: ${JSON.stringify(res)}`);
        this.posts = res;
      });
    } catch (err) {
      console.error(err);
    }
  }

  //async getPost(id: number) {
  //  try {
  //    const res = await this.postService.getPost(id);
  //    if (!res) {
  //      console.log('response empty');
  //      return;
  //    }
  //    console.log(res);
  //    res.subscribe(res => {
  //      console.log(JSON.stringify(res));
  //    });
  //  } catch (err) {
  //    console.error(err);
  //  }
  //}

  add() {
    this.blogService.createBlog(this.blog).subscribe(res => console.log(res));
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
}
