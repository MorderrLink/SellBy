import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/pages';

const es = initEdgeStore.create();

/**
 * This is the main router for the edgestore buckets.
 */
const edgeStoreRouter = es.router({
  publicFiles: es
  .fileBucket({
    maxSize: 1024 * 1024 * 10,
    accept: ['image/jpeg', 'image/png', 'image/ico', 'image/webp', 'image/*'],
  })
  .beforeUpload(({ ctx, input, fileInfo }) => {
    
    return true; // allow upload
  })
  .beforeDelete(({ ctx, fileInfo }) => {

    return true;
  }),
  
});

export default createEdgeStoreNextHandler({
  router: edgeStoreRouter,

});

/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;