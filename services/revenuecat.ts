import { Platform } from 'react-native';
import Purchases, { type CustomerInfo, LOG_LEVEL, type PurchasesPackage } from 'react-native-purchases';

const entitlementId = 'premium';

function getApiKey() {
  if (Platform.OS === 'ios') {
    return process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY ?? '';
  }

  return process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY ?? '';
}

export async function initializeRevenueCat(appUserID?: string) {
  const configured = await Purchases.isConfigured().catch(() => false);
  if (configured) {
    return;
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return;
  }

  Purchases.setLogLevel(LOG_LEVEL.WARN);
  Purchases.configure({ apiKey, appUserID });
}

export function hasRevenueCatConfig() {
  return Boolean(getApiKey());
}

export async function fetchOfferings() {
  const apiKey = getApiKey();
  if (!apiKey) {
    return null;
  }

  const offerings = await Purchases.getOfferings();
  return offerings.current;
}

export async function purchasePackage(selectedPackage: PurchasesPackage) {
  const result = await Purchases.purchasePackage(selectedPackage);
  return result.customerInfo;
}

export async function restoreRevenueCatPurchases() {
  return Purchases.restorePurchases();
}

export async function getCustomerInfo() {
  const apiKey = getApiKey();
  if (!apiKey) {
    return null;
  }

  return Purchases.getCustomerInfo();
}

export async function openSubscriptionManagement() {
  return Purchases.showManageSubscriptions();
}

export function isPremiumCustomer(customerInfo: CustomerInfo | null) {
  return Boolean(customerInfo?.entitlements.active[entitlementId]);
}
