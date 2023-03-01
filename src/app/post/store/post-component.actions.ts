import { createAction, props } from '@ngrx/store';
import { Post, SearchRequest, SearchResponse } from '../post.service';

export const opened = createAction('[Posts page] Opened');

export const paginationChanged = createAction(
    '[Posts page] Pagination changed',
    props<{ page: number, offset: number }>()
);

export const queryChanged = createAction(
    '[Posts page] Query changed',
    (query: string) => ({ query })
);

export const searchPosts2 = createAction(
    '[Post/API] Search Posts2',
    props<{ searchQuery: string }>()
);

export const searchPosts = createAction(
    '[Post/API] Search Posts',
    props<{ request: SearchRequest }>()
);

export const loadPosts = createAction(
    '[Post/API] Load Posts',
    props<{ posts: Array<Post> | undefined }>()
);

export const searchResponse = createAction(
    '[Post/API] Search Response',
    props<{ response: SearchResponse | undefined }>()
);
  