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
const adminUsersRoute = "/admin"

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
  taxClass:{
    ADD_TAX_CLASS: `${app}${taxClassRoute}/add`,
    TAX_CLASS_LIST: `${app}${taxClassRoute}`,
    UPDATE_TAX_CLASS: `${app}${taxClassRoute}/update`
  },
  taxRules:{
    ADD_TAX_RULES: `${app}${taxRulesRoute}/add`,
    TAX_RULES_LIST: `${app}${taxRulesRoute}`,
    UPDATE_TAX_RULES: `${app}${taxRulesRoute}/update`
  },
  shipping: {
    SHIPPING_LIST: `${app}${shippingClassRoute}`
  },
  admin:{
    ADMIN_USERS: `${app}${adminUsersRoute}/admin-users`
  }
};
