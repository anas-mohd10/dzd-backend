const app = '/app'
const dashboardRoute = '/dashboard'
const catalogRoute = '/catalog'
const brandRoute = '/brand'
const product = '/product'
const category = '/category'

export const appRoutes = {
    DASHBOARD : `${dashboardRoute}`,
    catalog: {
        ADD_BRAND: `${catalogRoute}/brand/add`,
        BRAND_LIST: `${catalogRoute}/brand`,
        ACTIVE_BRAND_LIST: `${catalogRoute}/active-brand`,
    }
}