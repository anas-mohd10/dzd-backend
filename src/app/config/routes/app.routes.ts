const app = '/app';
const dashboardRoute = '/dashboard';
const catalogRoute = '/catalog';
const brandRoute = '/brand';
const productRoute = '/product';
const variantProductRoute = '/variant-product'
const categoryRoute = '/category';
const attributeRoute = '/attribute';
const collectionRoute = '/collection'
const offerRoute = '/offer'
const taxClassRoute = '/tax-classes'
const taxRulesRoute = "/tax-rules"
const shippingClassRoute = "/shipping"
const adminUsersRoute = "/admin-users"
const rolesRoute = "/roles"
const orderRoute = "/orders"
const customerRoute = "/customers"
const couponRoute = '/coupons'
const contactRoute = '/contacts'
const socialMediaRoute = "/social-media"
const invoiceSettingRoute = "/invoice-settings"
const productReportRoute = "/product-report"
const customerReportRoute = "/customer-report"
const orderReportRoute = "/order-report"

export const appRoutes = {
  DASHBOARD: `${app}${dashboardRoute}`,
  brand: {
    ADD_BRAND: `${app}${brandRoute}/add`,
    BRAND_LIST: `${app}${brandRoute}`,
    ACTIVE_BRAND_LIST: `${catalogRoute}/active-brand`,
    UPDATE_BRAND: `${app}${brandRoute}/update`
  },
  category: {
    ADD_CATEGORY: `${app}${categoryRoute}/add`,
    CATEGORY_LIST: `${app}${categoryRoute}`,
    UPDATE_CATEGORY: `${app}${categoryRoute}/update`
  },
  attribute: {
    ADD_ATTRIBUTE: `${app}${attributeRoute}/add`,
    ATTRIBUTE_LIST: `${app}${attributeRoute}`,
    UPDATE_ATTRIBUTE: `${app}${attributeRoute}/update`
  },
  product: {
    ADD_PRODUCT: `${app}${productRoute}/add`,
    PRODUCT_LIST: `${app}${productRoute}`,
    UPDATE_PRODUCT: `${app}${productRoute}/update`
  },
  variantProduct: {
    ADD_VARIANT_PRODUCT: `${app}${variantProductRoute}/add`,
    VARIANT_PRODUCT_LIST: `${app}${variantProductRoute}`,
    UPDATE_VARIANT_PRODUCT: `${app}${variantProductRoute}/update`
  },
  collection: {
    ADD_COLLECTION: `${app}${collectionRoute}/add`,
    COLLECTION_LIST: `${app}${collectionRoute}`,
    UPDATE_COLLECTION: `${app}${collectionRoute}/update`
  },
  offer: {
    ADD_OFFER: `${app}${offerRoute}/add`,
    OFFER_LIST: `${app}${offerRoute}`,
    UPDATE_OFFER: `${app}${offerRoute}/update`
  },
  taxClass: {
    ADD_TAX_CLASS: `${app}${taxClassRoute}/add`,
    TAX_CLASS_LIST: `${app}${taxClassRoute}`,
    UPDATE_TAX_CLASS: `${app}${taxClassRoute}/update`
  },
  taxRules: {
    ADD_TAX_RULES: `${app}${taxRulesRoute}/add`,
    TAX_RULES_LIST: `${app}${taxRulesRoute}`,
    UPDATE_TAX_RULES: `${app}${taxRulesRoute}/update`
  },
  shipping: {
    SHIPPING_LIST: `${app}${shippingClassRoute}`
  },
  admin: {
    ADMIN_USERS: `${app}${adminUsersRoute}`,
    ADD_ADMIN_USERS: `${app}${adminUsersRoute}/add`,
    UPDATE_ADMIN_USERS: `${app}${adminUsersRoute}/update`
  },
  roles: {
    ROLES_LIST: `${app}${rolesRoute}`,
    ADD_ROLES: `${app}${rolesRoute}/add`,
    UPDATE_ROLES: `${app}${rolesRoute}/update`,
  },
  orders: {
    ORDERS_LIST: `${app}${orderRoute}`,
    ADD_ORDER_LIST: `${app}${orderRoute}/add`,
    UPDATE_ORDER_LIST: `${app}${orderRoute}/update`
  },
  customers: {
    CUSTOMERS_LIST: `${app}${customerRoute}`,
    ADD_CUSTOMERS_LIST: `${app}${customerRoute}/add`,
    UPDATE_CUSTOMERS_LIST: `${app}${customerRoute}/update`,
  },
  coupons: {
    COUPONS_LIST: `${app}${couponRoute}`,
    ADD_COUPONS_LIST: `${app}${couponRoute}/add`,
    UPDATE_COUPONS_LIST: `${app}${couponRoute}/update`,
  },
  contacts: {
    CONTACTS_LIST: `${app}${contactRoute}`,
    ADD_CONTACTS_LIST: `${app}${contactRoute}/add`,
    UPDATE_CONTACTS_LIST: `${app}${contactRoute}/update`
  },
  socialMedia: {
    SOCIAL_MEDIA_LIST: `${app}${socialMediaRoute}`,
    ADD_SOCIAL_MEDIA_LIST: `${app}${socialMediaRoute}/add`,
    UPDATE_SOCIAL_MEDIA_LIST: `${app}${socialMediaRoute}/manage`
  },
  invoiceSettings: {
    INVOICE_SETTINGS_LIST: `${app}${invoiceSettingRoute}`,
    ADD_INVOICE_SETTINGS: `${app}${invoiceSettingRoute}/add`,
    UPDATE_INVOICE_SETTINGS: `${app}${invoiceSettingRoute}/update`
  },
  reports: {
    PRODUCT_REPORT: `${app}${productReportRoute}`,
    CUSTOMER_REPORT: `${app}${customerReportRoute}`,
    ORDER_REPORT: `${app}${orderReportRoute}`,
  }
};
