import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'connections',
  library: { type: 'var', name: 'connections' },
  exposes: {
    './Module': './src/remote-entry.ts',
  },
  // Configure shared dependencies to match the host configuration
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
