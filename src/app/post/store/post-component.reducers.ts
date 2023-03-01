import { createReducer, on } from "@ngrx/store";
import { loadPosts, opened, paginationChanged, queryChanged, searchResponse } from "./post-component.actions";
import { Post } from '../../core/api/v1';

export const featureKey = 'posts';

export interface PostComponentState {
    posts: Post[] | undefined;
    selectedPostId: null;
    isLoading: boolean;
    error: string | null;
    pagination: {
        totalItems: number | undefined,
        pageNumber: number | undefined,
    };
}

const defaultState: PostComponentState = {
    posts: new Array<Post>,
    selectedPostId: null,
    isLoading: false,
    error: null,
    pagination: {
        totalItems: undefined,
        pageNumber: 1
    },
};

export const postsReducer = createReducer(
    defaultState,
    on(opened, (state) => ({ ...state, posts: new Array<Post> })),
    on(paginationChanged, (state) => ({ ...state, posts: new Array<Post> })),
    on(queryChanged, (state, action) => ({ ...state, query: action.query  })),
    //on(queryDetailLoaded, (state, action) => ({ ...state, selectedPostId: action.postId  })),
    on(loadPosts, (state, action) => ({ ...state, posts: action.posts })),
    on(searchResponse, (state, action) => ({
        ...state,
        posts: action.response?.data,
        pagination: {
            totalItems: action.response?.totalItems,
            pageNumber: action.response?.pageNumber,
        }
    })),
);

export const selectPosts = (state: PostComponentState) => state.posts;
export const selectIsLoading = (state: PostComponentState) => state.isLoading;
export const selectError = (state: PostComponentState) => state.error;
export const selectPagination = (state: PostComponentState) => state.pagination;
