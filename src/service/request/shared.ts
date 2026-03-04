import { useAuthStore } from '@/store/modules/auth';
import { getCurrentTenantId, getRefreshToken, getToken, updateAuthTokens } from '@/store/modules/auth/shared';
import { resolvePreferredLocale } from '@/locales/default-locale';
import { $t } from '@/locales';
import { fetchRefreshToken } from '../api';
import type { RequestInstanceState } from './type';
import { buildRequestContextHeaders, resolveServiceCodeConfig } from './context';

const runtimeEnv = ((import.meta as ImportMeta & { env?: Partial<Env.ImportMeta> }).env ||
  {}) as Partial<Env.ImportMeta>;
const serviceCodeConfig = resolveServiceCodeConfig(runtimeEnv);

export const serviceSuccessCode = serviceCodeConfig.successCode;
export const logoutCodes = serviceCodeConfig.logoutCodes;
export const modalLogoutCodes = serviceCodeConfig.modalLogoutCodes;
export const expiredTokenCodes = serviceCodeConfig.expiredTokenCodes;

const backendMessageI18nMap: Partial<Record<string, App.I18n.I18nKey>> = {
  'User is inactive': 'page.login.common.userInactive',
  'Email is not verified': 'page.login.common.emailNotVerified',
  'Username or password is incorrect': 'page.login.common.invalidCredentials',
  'Two-factor code required': 'page.login.common.twoFactorRequired',
  'Two-factor code is invalid': 'page.login.common.twoFactorInvalid'
};

function localizeBackendMessage(message: string): string {
  const normalized = String(message || '').trim();
  const i18nKey = backendMessageI18nMap[normalized];

  return i18nKey ? $t(i18nKey) : message;
}

export function getAuthorization() {
  const token = getToken();
  const Authorization = token ? `Bearer ${token}` : null;

  return Authorization;
}

export function createRequestContextHeaders(initialHeaders: Record<string, unknown> = {}) {
  return buildRequestContextHeaders(
    {
      authorization: getAuthorization(),
      locale: resolvePreferredLocale(),
      tenantId: getCurrentTenantId()
    },
    initialHeaders
  );
}

/** refresh token */
async function handleRefreshToken() {
  const { resetStore } = useAuthStore();

  const rToken = getRefreshToken();
  const { error, data } = await fetchRefreshToken(rToken);
  if (!error) {
    updateAuthTokens(data);
    return true;
  }

  resetStore();

  return false;
}

export async function handleExpiredRequest(state: RequestInstanceState) {
  if (!state.refreshTokenPromise) {
    state.refreshTokenPromise = handleRefreshToken();
  }

  const success = await state.refreshTokenPromise;

  setTimeout(() => {
    state.refreshTokenPromise = null;
  }, 1000);

  return success;
}

export function showErrorMsg(state: RequestInstanceState, message: string) {
  const localizedMessage = localizeBackendMessage(message);

  if (!state.errMsgStack?.length) {
    state.errMsgStack = [];
  }

  const isExist = state.errMsgStack.includes(localizedMessage);

  if (!isExist) {
    state.errMsgStack.push(localizedMessage);

    window.$message?.error(localizedMessage, {
      onLeave: () => {
        state.errMsgStack = state.errMsgStack.filter(msg => msg !== localizedMessage);

        setTimeout(() => {
          state.errMsgStack = [];
        }, 5000);
      }
    });
  }
}
