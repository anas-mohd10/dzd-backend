const app = '/app';
const dashboardRoute = '/dashboard';
const catalogRoute = '/catalog';
const brandRoute = '/brand';
const productRoute = '/product';
const categoryRoute = '/category';
const attributeRoute = '/attribute';
const collectionRoute = '/collection'

export const appRoutes = {
  DASHBOARD: `${dashboardRoute}`,
  brand: {
    ADD_BRAND: `${app}${brandRoute}/add`,
    BRAND_LIST: `${app}${brandRoute}`,
    ACTIVE_BRAND_LIST: `${catalogRoute}/active-brand`,
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
  }
};
