// Reexport the native module. On web, it will be resolved to ExpoRootDeductorModule.web.ts
// and on native platforms to ExpoRootDeductorModule.ts
export { default } from './ExpoRootDeductorModule';
export { default as ExpoRootDeductorView } from './ExpoRootDeductorView';
export * from  './ExpoRootDeductor.types';
