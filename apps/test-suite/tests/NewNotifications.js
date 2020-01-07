'use strict';

import { Platform } from '@unimodules/core';
import * as Notifications from 'expo-notifications';

import * as TestUtils from '../TestUtils';
import { waitFor } from './helpers';

export const name = 'expo-notifications';

export async function test(t) {
  const shouldSkipTestsRequiringPermissions = await TestUtils.shouldSkipTestsRequiringPermissionsAsync();
  const describeWithPermissions = shouldSkipTestsRequiringPermissions ? t.xdescribe : t.describe;

  describeWithPermissions('expo-notifications', () => {
    t.describe('getDevicePushTokenAsync', () => {
      let subscription = null;
      let event = null;

      t.beforeAll(() => {
        subscription = Notifications.addTokenListener(newEvent => {
          event = newEvent;
        });
      });

      t.afterAll(() => {
        if (subscription) {
          subscription.remove();
          subscription = null;
        }
      });

      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        let token = null;
        t.it('resolves with a string', async () => {
          const devicePushToken = await Notifications.getDevicePushTokenAsync();
          t.expect(typeof devicePushToken.data).toBe('string');
          token = devicePushToken;
        });

        t.it('emits an event with token', async () => {
          await waitFor(500);
          t.expect(event).toEqual(token);
        });
      }

      if (Platform.OS === 'web') {
        let token = null;

        t.it('resolves with an object', async () => {
          const devicePushToken = await Notifications.getDevicePushTokenAsync();
          t.expect(typeof devicePushToken.data).toBe('object');
          token = devicePushToken;
        });

        t.it('emits an event with token', async () => {
          await waitFor(500);
          t.expect(event).toEqual(token);
        });
      }
    });
  });
}
