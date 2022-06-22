const app = '/app';
const dashboardRoute = '/dashboard';
const catalogRoute = '/catalog';
const brandRoute = '/brand';
const productRoute = '/product';
const categoryRoute = '/category';
const attributeRoute = '/attribute';
const collectionRoute = '/collection'
const offerRoute = '/offer'
const taxClassRoute = '/tax-classes'

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
  },
  attribute: {
    ADD_ATTRIBUTE: `${app}${attributeRoute}/add`,
    ATTRIBUTE_LIST: `${app}${attributeRoute}`,
  },
  product: {
    ADD_PRODUCT: `${app}${productRoute}/add`,
    PRODUCT_LIST: `${app}${productRoute}`,
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
  }
};
