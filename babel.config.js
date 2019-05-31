module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      ['@babel/preset-env', { targets: { browsers: ['last 2 Chrome versions'] } }],
      '@babel/preset-react'
    ],
    plugins: [
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator',
      '@babel/plugin-proposal-export-namespace-from',
      ['@babel/plugin-proposal-pipeline-operator', { proposal: 'smart' }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      ['@babel/plugin-proposal-private-methods', { loose: true }],
      ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true, legacy: false }],
      ['module-resolver', {
        root: ['./'],
        alias: {
          '@components': './src/components',
          '@hooks': './src/hooks',
          '@lib': './src/lib'
        }
      }]
    ]
  };
};
