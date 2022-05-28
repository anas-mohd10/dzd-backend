const app = '/app'
const dashboardRoute = '/dashboard'
const catalogRoute = '/catalog'
const brandRoute = '/brand'
const product = '/product'
const category = '/category'

export const appRoutes = {
    DASHBOARD : `${dashboardRoute}`,
    brand: {
        ADD_BRAND: `${app}${brandRoute}/add`,
        BRAND_LIST: `${app}${brandRoute}`,
        ACTIVE_BRAND_LIST: `${catalogRoute}/active-brand`,
    },
    category:{
        ADD_CATEGORY: `${app}${category}/add`,
        CATEGORY_LIST: `${app}${category}`
    }
}