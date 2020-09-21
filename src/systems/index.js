/* eslint-disable global-require */
/**
 * Created by GaoBo on 2017/12/28.
 * Rewrite by GaoBo on 2018/01/04, 2018/8/22.
 */
import { systemConfig } from '@/../.startup/system';
import system from '../../.startup/startup';
import createDefaultSysconfig from './default-config';


const { System, Source, AvailableSystems } = system || {};
if (!systemConfig) {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error(`System Error! Config file not found! "systems/${System}/config.js"`);
  } else {
    throw new Error('System config not found!');
  }
}

// generate sysconfig and fill!
const sysconfig = {
  ...createDefaultSysconfig(System, Source),
  ...systemConfig,
};

// All Configs

let allSystemConfigs; // a cache.

// TODO umi...
const getAllSystemConfigs = () => {
  if (!allSystemConfigs) {
    allSystemConfigs = AvailableSystems && AvailableSystems.map(sys => ({
      ...createDefaultSysconfig(sys, sys),
    }));
  }
  return allSystemConfigs;
};

export { sysconfig, getAllSystemConfigs, AvailableSystems };
