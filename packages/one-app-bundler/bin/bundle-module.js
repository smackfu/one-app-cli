#! /usr/bin/env node
/*
 * Copyright 2022 American Express Travel Related Services Company, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations
 * under the License.
 */
const path = require('node:path');
const fs = require('node:fs');

const bundleModule = async () => {
  const {
    devBuildModule,
    bundleExternalFallbacks,
  } = await import('@americanexpress/one-app-dev-bundler');

  fs.writeFileSync(path.join(process.cwd(), 'bundle.integrity.manifest.json'), JSON.stringify({}));

  await bundleExternalFallbacks();

  if (process.env.NODE_ENV !== 'production' && process.argv.includes('--dev')) {
    console.info('Running dev bundler');

    if (devBuildModule) {
      devBuildModule().catch((error) => {
        console.error(`Build failed with error ${error.message}`);
        console.error(error);
        throw error;
      });
    }
  } else {
    if (process.argv.includes('--dev')) {
      console.info('Ignoring `--dev` flag for NODE_ENV=production');
    }
    console.info('Running production bundler');
    // eslint-disable-next-line global-require -- Only require the bundler when it runs
    require('./webpack-bundle-module');
  }
};

bundleModule();
