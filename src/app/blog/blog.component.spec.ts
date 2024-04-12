import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogComponent } from './blog.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from 'src/material.module';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BlogService } from '../core/api/v1/api/blog.service';
import { Observable, of } from 'rxjs';
import { Blog, BlogSearchRequest, BlogSearchResponse, Post } from '../core/api/v1';
import { RouterModule } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { By } from '@angular/platform-browser';

describe('BlogComponent', () => {
  let component: BlogComponent;
  let fixture: ComponentFixture<BlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogComponent ],
      imports: [RouterModule, BrowserAnimationsModule, FormsModule, HttpClientModule, MaterialModule ],
      providers: [
        {provide: BlogService, useClass: BlogServiceStub}
      ]
    })
    .compileComponents();

    // below fix may be necessary in some cases (where provider is within module via barrel? todo: review this)
    //TestBed.overrideComponent(BlogComponent, {set: {providers: [{provide: BlogService, useClass: BlogServiceStub}]}});
    fixture = TestBed.createComponent(BlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have button titled "Create"', () => {
    const buttons = fixture.debugElement.queryAll(By.directive(MatButton));
    //debugger;
    expect(buttons[0].nativeElement.textContent).toBe('Create');
  });

  it('should have blog count of 2', () => {
    expect(component.blogs.length).toBe(2);
  });
});

class BlogServiceStub {
  searchBlogs2(req: BlogSearchRequest): Observable<BlogSearchResponse> {
    return of(
      { data: [
        { blogId: 1, url: 'https://test-blog.vorba.com/1', posts: [] as Post[] } as Blog,
        { blogId: 2, url: 'https://test-blog.vorba.com/2', posts: [] as Post[] } as Blog,
      ] as Blog[]
    } as BlogSearchResponse)
  }
}
