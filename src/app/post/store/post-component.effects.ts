//import { products } from './products.selectors';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, debounceTime, delay, tap } from 'rxjs/operators';

import { PostService } from '../post.service';
//import { loadProducts, requestLoadProducts, searchProduct } from './product.actions';
import { loadPosts, searchPosts2, searchPosts, searchResponse } from './post-component.actions';

@Injectable()
export class PostEffects {

    constructor(
        private actions$: Actions,
        private service: PostService
    ) {}

    //loadProducts$ = createEffect(() =>
    //this.actions$.pipe(
    //  ofType(requestLoadProducts),
    //  switchMap(action =>
    //    this.service.load().pipe(
    //      delay(3000),
    //      map(data => loadProducts({products: data}))
    //  ))
    //)
    //);

    searchProduct$ = createEffect(() => this.actions$.pipe(
        ofType(searchPosts2),
        switchMap(action => this.service
            //.search(3, action.queryString, 0, 5)
            .search(3, action.searchQuery, 0, 5)
            .pipe(
                tap(data => console.log(`${searchPosts2.type} response: ${JSON.stringify(data)}`)),
                delay(1000),
                map(data => {
                    console.log(`${searchPosts2.type} data: ${JSON.stringify(data)}`);
                    return loadPosts({posts: data});
                })
            ))
        )
    );

    searchPosts$ = createEffect(() => this.actions$.pipe(
        ofType(searchPosts),
        tap(action => console.log(`request: ${JSON.stringify(action.request)}`)),
        switchMap(action => this.service
            //.search(3, action.queryString, 0, 5)
            .search2(action.request)
            .pipe(
                tap(response => console.log(`${searchPosts.type} response: ${JSON.stringify(response)}`)),
                delay(1000),
                //map(response => loadPosts({posts: response.data}))
                map(response => searchResponse({response}))
            ))
        )
    );
}
