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
const orderRoute = "/placed-orders"
const customerRoute = "/customers"
const couponRoute = '/coupons'
const contactRoute = '/contacts'
const socialMediaRoute = "/social-media"
const invoiceSettingRoute = "/invoice-settings"
const productReportRoute = "/product-report"
const customerReportRoute = "/customer-report"
const orderReportRoute = "/order-report"
const pendingOrderReportRoute = "/pending-orders"
const returnRoute = "/return-lists"
const bannerRoute = "/banners"
const layoutRoute = "/layouts"
const cartRoute = "/cart"
const reviewRoute = "/reviews"
const vouchersRoute = "/vouchers"
const faqRoute = "/faq"
const testimonialRoute = "/testimonials"
const notificationsRoute = "/notifications"
const aboutRoute = "/about"
const helpcenterRoute = "/help-center"
const privacypolicyRoute = "/privacy-policy"
const termsconditionsRoute = "/terms-conditions"
const pageLimitsRoutes = "/page-limits"
const generalSettingsRoutes = "/app-settings"

export const appRoutes = {
  BASE: "http://localhost:3000/",
  DASHBOARD: `${app}${dashboardRoute}`,
  brand: {
    ADD_BRAND: `${app}${brandRoute}/add`,
    BRAND_LIST: `${app}${brandRoute}`,
    ACTIVE_BRAND_LIST: `${catalogRoute}/active-brand`,
    UPDATE_BRAND: `${app}${brandRoute}/update`,
    ARCHIVED_BRAND: `${app}${brandRoute}/archive`
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
    PRODUCT_LIST: `${app}${productRoute}/list`,
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
    UPDATE_ORDER_LIST: `${app}${orderRoute}/update`,
    PENDING_ORDERS_LIST: `${app}${pendingOrderReportRoute}`,
    UPDATE_PENDING_ORDER: `${app}${pendingOrderReportRoute}/update`
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
    UPDATE_SOCIAL_MEDIA_LIST: `${app}${socialMediaRoute}/update`
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
  },
  returns: {
    RETURN_LIST: `${app}${returnRoute}`,
    UPDATE_RETURN: `${app}${returnRoute}/update`
  },
  banner: {
    BANNER_LIST: `${app}${bannerRoute}`,
    ADD_BANNER: `${app}${bannerRoute}/add`,
    UPDATE_BANNER: `${app}${bannerRoute}/update`
  },
  layout: {
    LAYOUT_LIST: `${app}${layoutRoute}`,
    ADD_LAYOUT: `${app}${layoutRoute}/add`,
    UPDATE_LAYOUT: `${app}${layoutRoute}/update`
  },
  cart: {
    CART_LIST: `${app}${cartRoute}`,
    UPDATE_CART_LIST: `${app}${cartRoute}/update`
  },
  review: {
    REVIEW_LIST: `${app}${reviewRoute}`,
  },
  vouchers: {
    VOUCHERS_LIST: `${app}${vouchersRoute}`,
    ADD_VOUCHERS_LIST: `${app}${vouchersRoute}/add`,
    UPDATE_VOUCHERS_LIST: `${app}${vouchersRoute}/update`
  },
  faq: {
    FAQ_LIST: `${app}${faqRoute}`,
    ADD_FAQ: `${app}${faqRoute}/add`,
    UPDATE_FAQ: `${app}${faqRoute}/update`,
  },
  testimonial: {
    TESTIMONIAL_LIST: `${app}${testimonialRoute}`,
    ADD_TESTIMONIAL: `${app}${testimonialRoute}/add`,
    UPDATE_TESTIMONIAL: `${app}${testimonialRoute}/update`
  },
  notification: {
    NOTIFICATION_LIST: `${app}${notificationsRoute}`,
    ADD_NOTIFICATION: `${app}${notificationsRoute}/add`,
    UPDATE_NOTIFICATION: `${app}${notificationsRoute}/update`,
  },
  about: {
    ABOUT: `${app}${aboutRoute}`
  },
  helpcenter: {
    HELPCENTER: `${app}${helpcenterRoute}`
  },
  privacypolicy: {
    PRIVACYPOLICY: `${app}${privacypolicyRoute}`
  },
  termsconditions: {
    TERMSCONDITIONS: `${app}${termsconditionsRoute}`
  },
  pageLimits: {
    PAGE_LIMITS_LIST: `${app}${pageLimitsRoutes}`,
    ADD_PAGE_LIMITS: `${app}${pageLimitsRoutes}/add`,
    UPDATE_PAGE_LIMITS: `${app}${pageLimitsRoutes}/update`,
  },
  appSettings: {
    APP_SETTINGS_LIST: `${app}${generalSettingsRoutes}`,
    ADD_APP_SETTINGS: `${app}${generalSettingsRoutes}/add`,
    UPDATE_APP_SETTINGS: `${app}${generalSettingsRoutes}/update`,
  }
};
