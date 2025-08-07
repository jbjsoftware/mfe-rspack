import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'host',
  /**
   * To use a remote that does not exist in your current Nx Workspace
   * You can use the tuple-syntax to define your remote
   *
   * remotes: [['my-external-remote', 'https://nx-angular-remote.netlify.app']]
   *
   * You _may_ need to add a `remotes.d.ts` file to your `src/` folder declaring the external remote for tsc, with the
   * following content:
   *
   * declare module 'my-external-remote';
   *
   */
  // Re-enable remotes with proper shared configuration
  remotes:
    process.env.NODE_ENV === 'production'
      ? [
          ['dashboard', '/_mf/dashboard/'],
          ['connections', '/_mf/connections/'],
        ]
      : ['dashboard', 'connections'],

  // Configure shared dependencies to load eagerly to avoid loadShareSync errors
  shared: (libraryName, defaultConfig) => {
    // Force all React-related dependencies to be eager
    if (
      libraryName === 'react' ||
      libraryName.startsWith('react-') ||
      libraryName.startsWith('react/') // Include react/jsx-runtime, react/jsx-dev-runtime, etc.
    ) {
      return {
        singleton: true,
        eager: true,
        requiredVersion: false, // Allow any version
      };
    }
    return defaultConfig;
  },
};

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
