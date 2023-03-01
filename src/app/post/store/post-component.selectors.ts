import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromStore from './post-component.reducers';

const postComponentSelector = createFeatureSelector<fromStore.PostComponentState>(fromStore.featureKey);

export const posts = createSelector(postComponentSelector, fromStore.selectPosts);
export const isLoading = createSelector(postComponentSelector, fromStore.selectIsLoading);
//export const products = createSelector(postComponentSelector, fromStore.selectAll);
export const error = createSelector(postComponentSelector, fromStore.selectError);
export const pagination = createSelector(postComponentSelector, fromStore.selectPagination);
