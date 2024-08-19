import { environment } from "src/environments/environment.prod";

const app = '/app';
const dashboardRoute = '/dashboard';
const catalogRoute = '/catalog';
const brandRoute = '/brands';
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
const storeSettings = "/store-settings"
const dashboardSettings = "/home-settings"
const myAccount = '/my-account'
const seoDetails = '/seo-details'
const timeSlotDetails = '/time-slots'
const stores = '/stores'
const enquires = '/enquiries'
const wishlist = '/wishlist'

export const appRoutes = {
  BASE: environment.base,
  DASHBOARD: `${app}${dashboardRoute}`,
  brand: {
    ADD_BRAND: `${app}${brandRoute}/add`,
    BRAND_LIST: `${app}${brandRoute}`,
    UPDATE_BRAND: `${app}${brandRoute}/update`,
    ARCHIVED_BRAND: `${app}${brandRoute}/archived`
  },
  category: {
    ADD_CATEGORY: `${app}${categoryRoute}/add`,
    CATEGORY_LIST: `${app}${categoryRoute}`,
    UPDATE_CATEGORY: `${app}${categoryRoute}/update`,
    ARCHIVED_CATEGORY: `${app}${categoryRoute}/archived`
  },
  attribute: {
    ADD_ATTRIBUTE: `${app}${attributeRoute}/add`,
    ATTRIBUTE_LIST: `${app}${attributeRoute}`,
    UPDATE_ATTRIBUTE: `${app}${attributeRoute}/update`
  },
  product: {
    ADD_PRODUCT: `${app}${productRoute}/add`,
    PRODUCT_LIST: `${app}/product-head`,
    ALL_PRODUCTS: `${app}${productRoute}`,
    UPDATE_PRODUCT: `${app}${productRoute}/update`,
    ARCHIVED_PRODUCT: `${app}${productRoute}/archive`,
    PRODUCT_SUCCESS: `${app}${productRoute}/success`
  },
  variantProduct: {
    ADD_VARIANT_PRODUCT: `${app}${variantProductRoute}/add`,
    VARIANT_PRODUCT_LIST: `${app}${variantProductRoute}`,
    UPDATE_VARIANT_PRODUCT: `${app}${variantProductRoute}/update`,
  },
  collection: {
    ADD_COLLECTION: `${app}${collectionRoute}/add`,
    COLLECTION_LIST: `${app}${collectionRoute}`,
    UPDATE_COLLECTION: `${app}${collectionRoute}/update`,
    ARCHIVED_COLLECTION: `${app}${collectionRoute}/archive`
  },
  offer: {
    ADD_OFFER: `${app}/add-offer`,
    OFFER_LIST: `${app}${offerRoute}`,
    UPDATE_OFFER: `${app}/update-offer`
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
    SHIPPING_LIST: `${app}${shippingClassRoute}`,
    ADD_SHIPPING: `${app}${shippingClassRoute}/add`,
    UPDATE_SHIPPING: `${app}${shippingClassRoute}/update`
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
    UPDATE_PENDING_ORDER: `${app}${pendingOrderReportRoute}/update`,
    GENERATE_INVOICE: `${app}${orderRoute}/generate-invoice`,
    PACKING_SLIP: `${app}${orderRoute}/packing-slip`,
  },
  customers: {
    CUSTOMERS_LIST: `${app}${customerRoute}`,
    ADD_CUSTOMERS_LIST: `${app}${customerRoute}/add`,
    UPDATE_CUSTOMERS_LIST: `${app}${customerRoute}/update`,
    referralHistory: `${app}${customerRoute}/referral-history`,
    newsletterSubscribers: `${app}${customerRoute}/newsletter-subscribers`,
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
  storeSettings: {
    STORE_SETTINGS: `${app}${storeSettings}`,
    ADD_APP_SETTINGS: `${app}${storeSettings}/add`,
    UPDATE_APP_SETTINGS: `${app}${storeSettings}/update`,
  },
  dashboardSettings: {
    DASHBOARD_SETTINGS_LIST: `${app}${dashboardSettings}`,
    ADD_DASHBOARD_SETTINGS: `${app}${dashboardSettings}/add`,
    UPDATE_DASHBOARD_SETTINGS: `${app}${dashboardSettings}/update`,
  },
  account: {
    MY_ACCOUNT: `${app}${myAccount}`
  },
  seo: {
    SEO_DETAILS: `${app}${seoDetails}`
  },
  timeslots: {
    TIME_SLOTS: `${app}${timeSlotDetails}`
  },
  stores: {
    ADD_STORE: `${app}${stores}/add`,
    UPDATE_STORE: `${app}${stores}/update`,
    STORE_LIST: `${app}${stores}`,
  },
  enquires: {
    ENQUIRY_LIST: `${app}${enquires}`
  },
  wishlist: {
    LIST: `${app}${wishlist}`,
    DETAILS: `${app}${wishlist}/details`
  },
  DYNAMIC_SCRIPTS: {
    LIST: `${app}/dynamic-scripts`
  },
  analytics: {
    LIST: `${app}/analytics`
  },
  feeds: {
    LIST: `${app}/feeds`
  },
  reports: {
    LIST: `${app}/reports`,
    DETAILED_ORDER: `${app}/reports/detailed-orders`,
  },
  navigation: `${app}/navigation`,
  subscribers: {
    SUBSCRIBERS_LIST: `${app}/user-alerts`,
  },
  shippingPolicy: `${app}/shipping-policy`,
  serviceWarranty: `${app}/service-warranty`,
  paymentPolicy: `${app}/payment-policy`,
  refundPolicy: `${app}/refund-policy`,
  mobileApps: `${app}/mobile-apps`,
  mailerSubscriptions: `${app}/mailer-subscriptions`,
  shippingSettings: `${app}/shipping-settings`,
  monthlyComparison: `${app}/monthly-comparison`,
  storePopup: `${app}/store-popup`,
  activityLogs: `${app}/activity-logs`,
  mediaLibrary: `${app}/media-library`,
  salesAnalytics: `${app}/sales-analytics`,
  moreOffers: {
    list: `${app}/more-offers`,
    add: `${app}/more-offers/add`,
    update: `${app}/more-offers/update`
  },
  vouchers: {
    list: `${app}/vouchers`,
    add: `${app}/vouchers/create`,
    update: `${app}/vouchers/update`
  },
  deliverySlots: `${app}/delivery-slots`,
  blogs: {
    list: `${app}/blogs`,
    create: `${app}/blogs/create-blog`,
    update: `${app}/blogs/update-blog`
  },
  catalogs: {
    list: `${app}/catalogs`,
    create: `${app}/catalogs/create-catalog`,
    update: `${app}/catalogs/update-catalog`
  },
  returns: `${app}/returns`,
  loyalty: `${app}/loyalty`,
  referralProgram: `${app}/referral`,
  sitemap: `${app}/sitemap`,
  giftWraps: `${app}/gift-wrap`,
  bannerImages: `${app}/banner-images`,
  designs: {
    home: "/designs/home",
    catalogs: "/designs/catalogs",
    theme: "/designs/theme",
    appImages: "/designs/app-images",
    contactUs: "/designs/contact-us",
    aboutUs: "/designs/about-us",
    productDesigns: '/designs/product-designs'
  },
  customMailers: `${app}/custom-mailers`,
  mailerDetails: `${app}/mailer-details`,
  bulk: {
    import: `${app}/bulk-import`,
  },
  pageCovers: `${app}/page-covers`,
  replaceRequests: `${app}/replace-requests`,
  guestCustomers: `${app}/guests`,
  shippingCharges: `${app}/shipping-charges`,
  staticPages: {
    list: `${app}/static-pages`,
    create: `${app}/static-pages/add`,
    update: `${app}/static-pages/update`
  },
  paymentSettings: `${app}/payment-settings`,
  shippingRules: `${app}/shipping-rules`,
  internationalisation: `${app}/internationalization`,
  smsSettings: `${app}/sms-settings`,
  authSettings: `${app}/auth-settings`,
  pickupLocations: {
    list: `${app}/pickup-locations`,
    create: `${app}/pickup-locations/add`,
    update: `${app}/pickup-locations/update`
  }
}
