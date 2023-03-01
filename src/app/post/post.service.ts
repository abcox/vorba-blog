import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { Post, BlogService, PostService as postService, PostsSearchRequest, PostsSearchResponse } from '../core/api/v1';


@Injectable({
    providedIn: 'root'
})
export class PostService {

    constructor(
        private blogService: BlogService,
        private postService: postService,
        ) { }

    search(
        id: number,
        query: string,
        pageIndex: number,
        pageSize: number): Observable<Post[]> {
            console.log(`search request: ${JSON.stringify({id, query, pageSize, pageIndex})}`)
            return this.blogService.searchPosts(id, query, pageSize, pageIndex);
    }

    search2(request: PostsSearchRequest): Observable<PostsSearchResponse> {
            console.log(`search2 request: ${JSON.stringify(request)}`);
            return this.postService.searchPosts2(request);
    }
}

export {
    PostsSearchRequest as SearchRequest,
    PostsSearchResponse as SearchResponse,
    Post
}
